const { sendTelegramMessage, sendTelegramMediaGroup, sendTelegramPhoto, sendTelegramDocument } = require('../_lib/telegram');
const {
    generateOrderId,
    parseOrderPayload,
    buildInvoiceOrderMessage,
    buildWorldwideOrderMessage,
    extractCustomPreviewItems,
    extractCustomSourceImages,
    extractAdminPreviewItems
} = require('../_lib/order-utils');

let waitUntil = null;
try {
    ({ waitUntil } = require('@vercel/functions'));
} catch (_) {}

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

async function sendOrderNotifications({ order, body, orderId, text, siteOrigin }) {
    const previews = extractCustomPreviewItems(order.items);
    const sourceImages = extractCustomSourceImages(order.items);
    const constructorMediaFiles = normalizeMediaReferences([
        ...previews.map((item) => item.image),
        ...sourceImages
    ], siteOrigin);
    const adminPreviews = extractAdminPreviewItems(order.items);
    const adminMediaFiles = normalizeMediaReferences(
        adminPreviews.map((item) => item.image).filter(Boolean),
        siteOrigin
    );

    if (order.receiptImage) {
        const captionLimit = 1024;
        const isPdf = String(order.receiptImage).startsWith('data:application/pdf');
        const sendMethod = isPdf ? sendTelegramDocument : sendTelegramPhoto;
        const receiptFilename = body.receiptName || null;

        if (text.length <= captionLimit) {
            await withRetry('send receipt with caption', () => sendMethod(order.receiptImage, text, receiptFilename), {
                attempts: 3,
                baseDelayMs: 800
            });
        } else {
            await withRetry(
                'send receipt fallback caption',
                () => sendMethod(order.receiptImage, `🧾 Квитанція до замовлення ${orderId}`, receiptFilename),
                {
                    attempts: 3,
                    baseDelayMs: 800
                }
            );
            await withRetry('send invoice order message', () => sendTelegramMessage(text), {
                attempts: 3,
                baseDelayMs: 800
            });
        }
    } else {
        await withRetry('send invoice order message', () => sendTelegramMessage(text), {
            attempts: 3,
            baseDelayMs: 800
        });
    }

    if (constructorMediaFiles.length) {
        const firstTitle = previews[0]?.title || 'Кастомний виріб';
        const caption = `🖼 Кастомний макет до замовлення ${orderId}\n${firstTitle}\n📎 Усі файли без стиснення`;
        try {
            await withRetry('send constructor media', () => sendTelegramMediaGroup(constructorMediaFiles, caption), {
                attempts: 3,
                baseDelayMs: 1200
            });
        } catch (previewError) {
            console.warn('Failed to send constructor media group to Telegram.', previewError);
            try {
                await withRetry(
                    'send constructor media warning',
                    () => sendTelegramMessage(`⚠️ Не вдалося надіслати файли макету до замовлення ${orderId}.`),
                    {
                        attempts: 2,
                        baseDelayMs: 600
                    }
                );
            } catch (_) {}
        }
    }

    if (adminMediaFiles.length) {
        const firstAdminTitle = adminPreviews[0]?.title || 'Адмін товар';
        const adminCaption = `🖼 Адмін макет до замовлення ${orderId}\n${firstAdminTitle}\n📎 Прев'ю товару з каталогу`;
        try {
            await withRetry('send admin media', () => sendTelegramMediaGroup(adminMediaFiles, adminCaption), {
                attempts: 3,
                baseDelayMs: 1200
            });
        } catch (adminPreviewError) {
            console.warn('Failed to send admin product media group to Telegram.', adminPreviewError);
        }
    }
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const body = parseRequestBody(req);
    const order = parseOrderPayload(body);
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || '';
    const siteOrigin = host ? `${protocol}://${host}` : '';

    if (!Number.isFinite(order.total) || order.total <= 0) {
        res.status(400).json({ error: 'Order total must be greater than zero.' });
        return;
    }

    if (!order.items.length) {
        res.status(400).json({ error: 'Cart is empty.' });
        return;
    }

    const orderId = generateOrderId();
    const text = order.orderType === 'worldwide'
        ? buildWorldwideOrderMessage({
            ...order,
            orderId,
            paymentMethod: 'worldwide'
        })
        : buildInvoiceOrderMessage({
            ...order,
            orderId,
            paymentMethod: 'invoice'
        });

    const notificationsPromise = sendOrderNotifications({ order, body, orderId, text, siteOrigin });

    res.status(200).json({
        ok: true,
        orderId
    });

    if (typeof waitUntil === 'function') {
        waitUntil(
            notificationsPromise.catch((error) => {
                console.error('Background Telegram notification failed.', error);
            })
        );
        return;
    }

    try {
        await notificationsPromise;
    } catch (error) {
        console.error('Background Telegram notification failed (no waitUntil).', error);
    }
};
