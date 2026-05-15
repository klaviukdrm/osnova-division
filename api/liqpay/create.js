const { sendTelegramMessage, sendTelegramMediaGroup } = require('../_lib/telegram');
const { buildSignature } = require('../_lib/liqpay');
const {
    generateOrderId,
    parseOrderPayload,
    buildCreatedOrderMessage,
    extractCustomPreviewItems,
    extractCustomSourceImages,
    extractAdminPreviewItems
} = require('../_lib/order-utils');

let waitUntil = null;
try {
    ({ waitUntil } = require('@vercel/functions'));
} catch (_) {
    waitUntil = null;
}

function parseRequestBody(req) {
    if (!req || req.body === undefined || req.body === null) return {};
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body !== 'string') return {};

    try {
        return JSON.parse(req.body);
    } catch (_) {
        return {};
    }
}

function scheduleBackgroundTask(taskPromise) {
    if (!taskPromise || typeof taskPromise.then !== 'function') return;
    if (typeof waitUntil === 'function') {
        try {
            waitUntil(taskPromise);
            return;
        } catch (error) {
            console.warn('Failed to register waitUntil task, falling back to detached promise.', error);
        }
    }

    // Fallback for local/dev runtimes without waitUntil support.
    void taskPromise;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(label, action, options = {}) {
    const attempts = Math.max(1, Number(options.attempts || 3));
    const baseDelayMs = Math.max(0, Number(options.baseDelayMs || 700));
    let lastError = null;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            return await action();
        } catch (error) {
            lastError = error;
            if (attempt >= attempts) break;

            const delayMs = baseDelayMs * attempt;
            console.warn(`[telegram] ${label} failed on attempt ${attempt}/${attempts}. Retrying in ${delayMs}ms...`, error?.message || error);
            await sleep(delayMs);
        }
    }

    throw lastError;
}

function toAbsoluteMediaReference(value, siteOrigin) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^data:/i.test(raw) || /^https?:\/\//i.test(raw)) return raw;
    if (!siteOrigin) return raw;

    const normalizedPath = raw.replace(/^\.?\/+/, '');
    return `${siteOrigin}/${normalizedPath}`;
}

function normalizeMediaReferences(values, siteOrigin) {
    return (Array.isArray(values) ? values : [])
        .map((value) => toAbsoluteMediaReference(value, siteOrigin))
        .map((value) => String(value || '').trim())
        .filter(Boolean);
}

async function notifyTelegramAboutCreatedOrder(order, orderId, siteOrigin) {
    const createdMessage = buildCreatedOrderMessage({
        ...order,
        orderId,
        paymentMethod: 'wallet'
    });

    let messageSent = false;
    try {
        await withRetry('send order message', () => sendTelegramMessage(createdMessage), {
            attempts: 3,
            baseDelayMs: 800
        });
        messageSent = true;
    } catch (messageError) {
        console.error('Failed to send base order message to Telegram.', messageError);
    }

    const previews = extractCustomPreviewItems(order.items);
    const sourceImages = extractCustomSourceImages(order.items);
    const constructorMediaFilesRaw = [
        ...previews.map((item) => item.image),
        ...sourceImages
    ].filter(Boolean);
    const constructorMediaFiles = normalizeMediaReferences(constructorMediaFilesRaw, siteOrigin);

    const adminPreviews = extractAdminPreviewItems(order.items);
    const adminMediaFilesRaw = adminPreviews.map((item) => item.image).filter(Boolean);
    const adminMediaFiles = normalizeMediaReferences(adminMediaFilesRaw, siteOrigin);

    let constructorSent = false;
    if (constructorMediaFiles.length) {
        const firstTitle = previews[0]?.title || 'Кастомний виріб';
        const caption = `🖼 Кастомний макет до замовлення ${orderId}\n${firstTitle}\n📎 Усі файли без стиснення`;
        try {
            await withRetry('send constructor media', () => sendTelegramMediaGroup(constructorMediaFiles, caption), {
                attempts: 3,
                baseDelayMs: 1200
            });
            constructorSent = true;
        } catch (previewError) {
            console.error('Failed to send constructor media group to Telegram.', previewError);
        }
    }

    let adminSent = false;
    if (adminMediaFiles.length) {
        const firstAdminTitle = adminPreviews[0]?.title || 'Адмін товар';
        const adminCaption = `🖼 Адмін макет до замовлення ${orderId}\n${firstAdminTitle}\n📎 Прев'ю товару з каталогу`;
        try {
            await withRetry('send admin media', () => sendTelegramMediaGroup(adminMediaFiles, adminCaption), {
                attempts: 3,
                baseDelayMs: 1200
            });
            adminSent = true;
        } catch (adminPreviewError) {
            console.error('Failed to send admin product media group to Telegram.', adminPreviewError);
        }
    }

    if (!messageSent || (constructorMediaFiles.length && !constructorSent) || (adminMediaFiles.length && !adminSent)) {
        try {
            await sendTelegramMessage(
                `⚠️ Частина даних по замовленню ${orderId} не була відправлена автоматично. Перевірте логи сервера.`
            );
        } catch (_) {}
    }
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const publicKey = process.env.LIQPAY_PUBLIC_KEY;
    const privateKey = process.env.LIQPAY_PRIVATE_KEY;
    const serverUrl = String(process.env.LIQPAY_SERVER_URL || '').trim();
    const envResultUrl = String(process.env.LIQPAY_RESULT_URL || '').trim();
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || '';
    const siteOrigin = host ? `${protocol}://${host}` : '';
    const fallbackUrl = siteOrigin ? `${siteOrigin}/` : '';
    const resultUrl = envResultUrl || req.headers.referer || fallbackUrl;

    if (!publicKey || !privateKey) {
        res.status(500).json({ error: 'LiqPay keys are not configured on server.' });
        return;
    }

    if (!serverUrl || !resultUrl) {
        res.status(500).json({ error: 'LIQPAY_SERVER_URL must be configured on server.' });
        return;
    }

    const body = parseRequestBody(req);
    const order = parseOrderPayload(body);
    const paymentMethod = String(order.paymentMethod || 'wallet').trim() || 'wallet';

    if (!Number.isFinite(order.total) || order.total <= 0) {
        res.status(400).json({ error: 'Order total must be greater than zero.' });
        return;
    }

    if (!order.items.length) {
        res.status(400).json({ error: 'Cart is empty.' });
        return;
    }

    const orderId = generateOrderId();

    const description = [
        'Order Ukrainian Print Family',
        `Customer: ${order.name || 'Buyer'}`,
        `Items: ${order.items.length}`,
        `Phone: ${order.phone || 'not specified'}`
    ].join(' | ');

    const liqPayPayload = {
        public_key: publicKey,
        version: '3',
        action: 'pay',
        amount: order.total.toFixed(2),
        currency: 'UAH',
        description,
        order_id: orderId,
        result_url: resultUrl,
        server_url: serverUrl,
        language: 'uk'
    };

    if (paymentMethod === 'wallet') {
        liqPayPayload.methods = 'apay';
        liqPayPayload.paytypes = 'gpay,apay,card';
    }

    const data = Buffer.from(JSON.stringify(liqPayPayload), 'utf8').toString('base64');
    const signature = buildSignature(privateKey, data);
    const checkoutUrl = `https://www.liqpay.ua/api/3/checkout?data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}`;

    // Return checkout URL immediately so user is redirected without waiting for Telegram uploads.
    res.status(200).json({
        orderId,
        checkoutUrl
    });

    const notifyPromise = notifyTelegramAboutCreatedOrder(order, orderId, siteOrigin).catch((error) => {
        console.error('Failed to notify Telegram about created LiqPay order.', error);
    });
    scheduleBackgroundTask(notifyPromise);
};
