const { sendTelegramMessage, sendTelegramMediaGroup, sendTelegramPhoto } = require('../_lib/telegram');
const {
    generateOrderId,
    parseOrderPayload,
    buildInvoiceOrderMessage,
    extractCustomPreviewItems,
    extractCustomSourceImages,
    extractAdminPreviewItems
} = require('../_lib/order-utils');

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

    try {
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
            if (text.length <= captionLimit) {
                await sendTelegramPhoto(order.receiptImage, text);
            } else {
                await sendTelegramPhoto(order.receiptImage, `\uD83E\uDDFE \u041a\u0432\u0438\u0442\u0430\u043d\u0446\u0456\u044f \u0434\u043e \u0437\u0430\u043c\u043e\u0432\u043b\u0435\u043d\u043d\u044f ${orderId}`);
                await sendTelegramMessage(text);
            }
        } else {
            await sendTelegramMessage(text);
        }

        if (constructorMediaFiles.length) {
            const firstTitle = previews[0]?.title || '\u041a\u0430\u0441\u0442\u043e\u043c\u043d\u0438\u0439 \u0432\u0438\u0440\u0456\u0431';
            const caption = `\uD83D\uDDBC \u041a\u0430\u0441\u0442\u043e\u043c\u043d\u0438\u0439 \u043c\u0430\u043a\u0435\u0442 \u0434\u043e \u0437\u0430\u043c\u043e\u0432\u043b\u0435\u043d\u043d\u044f ${orderId}\n${firstTitle}\n\uD83D\uDCCE \u0423\u0441\u0456 \u0444\u0430\u0439\u043b\u0438 \u0431\u0435\u0437 \u0441\u0442\u0438\u0441\u043d\u0435\u043d\u043d\u044f`;
            try {
                await sendTelegramMediaGroup(constructorMediaFiles, caption);
            } catch (previewError) {
                console.warn('Failed to send constructor media group to Telegram.', previewError);
            }
        }

        if (adminMediaFiles.length) {
            const firstAdminTitle = adminPreviews[0]?.title || '\u0410\u0434\u043c\u0456\u043d \u0442\u043e\u0432\u0430\u0440';
            const adminCaption = `\uD83D\uDDBC \u0410\u0434\u043c\u0456\u043d \u043c\u0430\u043a\u0435\u0442 \u0434\u043e \u0437\u0430\u043c\u043e\u0432\u043b\u0435\u043d\u043d\u044f ${orderId}\n${firstAdminTitle}\n\uD83D\uDCCE \u041f\u0440\u0435\u0432'\u044e \u0442\u043e\u0432\u0430\u0440\u0443 \u0437 \u043a\u0430\u0442\u0430\u043b\u043e\u0433\u0443`;
            try {
                await sendTelegramMediaGroup(adminMediaFiles, adminCaption);
            } catch (adminPreviewError) {
                console.warn('Failed to send admin product media group to Telegram.', adminPreviewError);
            }
        }
    } catch (error) {
        console.error('Failed to notify Telegram about invoice order.', error);
        res.status(502).json({ error: 'Failed to send order to Telegram. Check bot/chat configuration.' });
        return;
    }

    res.status(200).json({
        ok: true,
        orderId
    });
};
