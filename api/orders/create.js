const { sendTelegramMessage, sendTelegramMediaGroup, sendTelegramPhoto, sendTelegramDocument } = require('../_lib/telegram');
const {
    generateOrderId,
    parseOrderPayload,
    buildInvoiceOrderMessage,
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

async function sendOrderNotifications({ order, body, orderId, text }) {
    const previews = extractCustomPreviewItems(order.items);
    const sourceImages = extractCustomSourceImages(order.items);
    const constructorMediaFiles = [
        ...previews.map((item) => item.image),
        ...sourceImages
    ].filter(Boolean);
    const adminPreviews = extractAdminPreviewItems(order.items);
    const adminMediaFiles = adminPreviews.map((item) => item.image).filter(Boolean);

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

    if (constructorMediaFiles.length) {
        const firstTitle = previews[0]?.title || 'Кастомний виріб';
        const caption = `🖼 Кастомний макет до замовлення ${orderId}\n${firstTitle}\n📎 Усі файли без стиснення`;
        try {
            await sendTelegramMediaGroup(constructorMediaFiles, caption);
        } catch (previewError) {
            console.warn('Failed to send constructor media group to Telegram.', previewError);
            try {
                await sendTelegramMessage(`⚠️ Не вдалося надіслати файли макету до замовлення ${orderId}.`);
            } catch (_) {}
        }
    }

    if (adminMediaFiles.length) {
        const firstAdminTitle = adminPreviews[0]?.title || 'Адмін товар';
        const adminCaption = `🖼 Адмін макет до замовлення ${orderId}\n${firstAdminTitle}\n📎 Прев'ю товару з каталогу`;
        try {
            await sendTelegramMediaGroup(adminMediaFiles, adminCaption);
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

    const notificationsPromise = sendOrderNotifications({ order, body, orderId, text });

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
