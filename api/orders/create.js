const { sendTelegramMessage, sendTelegramPhoto, sendTelegramDocument } = require('../_lib/telegram');
const {
    generateOrderId,
    parseOrderPayload,
    buildInvoiceOrderMessage,
    extractCustomPreviewItems,
    extractCustomSourceImageGroups,
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

function buildCustomSourceLinksMessage(orderId, groups, siteOrigin) {
    const normalizedGroups = (Array.isArray(groups) ? groups : [])
        .map((group) => ({
            title: String(group?.title || 'Кастомний виріб').trim() || 'Кастомний виріб',
            images: normalizeMediaReferences(group?.images || [], siteOrigin).filter((value) => /^https?:\/\//i.test(value))
        }))
        .filter((group) => group.images.length);

    if (!normalizedGroups.length) return '';

    const lines = [`🔗 Посилання на файли кастомного замовлення ${orderId}`];

    normalizedGroups.forEach((group, groupIndex) => {
        lines.push('');
        lines.push(`${groupIndex + 1}. ${group.title}`);
        group.images.forEach((imageUrl, imageIndex) => {
            lines.push(`${groupIndex + 1}.${imageIndex + 1} ${imageUrl}`);
        });
    });

    return lines.join('\n').slice(0, 4000);
}

async function sendCustomPreviewPhotos(previews, orderId, siteOrigin) {
    const normalizedPreviews = (Array.isArray(previews) ? previews : [])
        .map((preview) => ({
            title: String(preview?.title || 'Кастомний виріб').trim() || 'Кастомний виріб',
            image: toAbsoluteMediaReference(preview?.image || '', siteOrigin)
        }))
        .filter((preview) => /^https?:\/\//i.test(preview.image));

    for (const preview of normalizedPreviews) {
        const caption = `🖼 Превʼю кастомного макета до замовлення ${orderId}\n${preview.title}\n👕 Так виглядає принт на виробі`;
        await sendTelegramPhoto(preview.image, caption);
    }
}

async function sendAdminPreviewPhotos(previews, orderId, siteOrigin) {
    const normalizedPreviews = (Array.isArray(previews) ? previews : [])
        .map((preview) => ({
            title: String(preview?.title || 'Адмін товар').trim() || 'Адмін товар',
            image: toAbsoluteMediaReference(preview?.image || '', siteOrigin)
        }))
        .filter((preview) => /^https?:\/\//i.test(preview.image));

    for (const preview of normalizedPreviews) {
        const caption = `🖼 Адмін макет до замовлення ${orderId}\n${preview.title}\n📎 Прев'ю товару з каталогу`;
        await sendTelegramPhoto(preview.image, caption);
    }
}

async function sendOrderNotifications({ order, body, orderId, text, siteOrigin }) {
    const previews = extractCustomPreviewItems(order.items);
    const sourceImageGroups = extractCustomSourceImageGroups(order.items);
    const adminPreviews = extractAdminPreviewItems(order.items);

    if (order.receiptImage) {
        const captionLimit = 1024;
        const isPdf = String(order.receiptImage).startsWith('data:application/pdf');
        const sendMethod = isPdf ? sendTelegramDocument : sendTelegramPhoto;
        const receiptFilename = body.receiptName || null;

        if (text.length <= captionLimit) {
            await sendMethod(order.receiptImage, text, receiptFilename);
        } else {
            await sendMethod(order.receiptImage, `🧾 Квитанція до замовлення ${orderId}`, receiptFilename);
            await sendTelegramMessage(text);
        }
    } else {
        await sendTelegramMessage(text);
    }

    const sourceLinksMessage = buildCustomSourceLinksMessage(orderId, sourceImageGroups, siteOrigin);
    if (sourceLinksMessage) {
        try {
            await sendTelegramMessage(sourceLinksMessage);
        } catch (sourceLinksError) {
            console.warn('Failed to send custom source links to Telegram.', sourceLinksError);
            try {
                await sendTelegramMessage(`⚠️ Не вдалося надіслати посилання на файли макета до замовлення ${orderId}.`);
            } catch (_) {}
        }
    }

    if (previews.length) {
        try {
            await sendCustomPreviewPhotos(previews, orderId, siteOrigin);
        } catch (previewError) {
            console.warn('Failed to send custom preview photos to Telegram.', previewError);
        }
    }

    if (adminPreviews.length) {
        try {
            await sendAdminPreviewPhotos(adminPreviews, orderId, siteOrigin);
        } catch (adminPreviewError) {
            console.warn('Failed to send admin product preview photos to Telegram.', adminPreviewError);
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
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || '';
    const siteOrigin = host ? `${protocol}://${host}` : '';
    const order = parseOrderPayload(body);

    if (!Number.isFinite(order.total) || order.total <= 0) {
        res.status(400).json({ error: 'Order total must be greater than zero.' });
        return;
    }

    if (!order.items.length) {
        res.status(400).json({ error: 'Cart is empty.' });
        return;
    }

    const orderId = generateOrderId();
    const text = buildInvoiceOrderMessage({
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
