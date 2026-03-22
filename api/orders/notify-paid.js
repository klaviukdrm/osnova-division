const { sendTelegramMessage, sendTelegramMediaGroup } = require('../_lib/telegram');
const {
    parseOrderPayload,
    buildCreatedOrderMessage,
    extractCustomPreviewItems,
    extractCustomSourceImages
} = require('../_lib/order-utils');
const { fetchLiqPayPaymentStatus } = require('../_lib/liqpay');

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

function normalizeStatus(value) {
    return String(value || '').trim().toLowerCase();
}

function isPaidStatus(status) {
    const paidStatuses = new Set(['success', 'sandbox']);
    return paidStatuses.has(normalizeStatus(status));
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const privateKey = String(process.env.LIQPAY_PRIVATE_KEY || '').trim();
    const publicKey = String(process.env.LIQPAY_PUBLIC_KEY || '').trim();
    if (!privateKey || !publicKey) {
        res.status(500).json({ error: 'LiqPay keys are not configured on server.' });
        return;
    }

    const body = parseRequestBody(req);
    const orderId = String(body?.orderId || '').trim();
    if (!orderId) {
        res.status(400).json({ error: 'Missing orderId.' });
        return;
    }

    const order = parseOrderPayload(body);
    if (!order.items.length || !Number.isFinite(order.total) || order.total <= 0) {
        res.status(400).json({ error: 'Invalid order payload.' });
        return;
    }

    const statusPayload = await fetchLiqPayPaymentStatus({
        publicKey,
        privateKey,
        orderId
    });

    const status = normalizeStatus(statusPayload?.status);
    if (!isPaidStatus(status)) {
        res.status(409).json({
            error: 'Payment is not confirmed yet.',
            status: status || 'unknown'
        });
        return;
    }

    if (!globalThis.__upfPaidOrderDetailsSent) {
        globalThis.__upfPaidOrderDetailsSent = new Set();
    }

    if (globalThis.__upfPaidOrderDetailsSent.has(orderId)) {
        res.status(200).json({ ok: true, skipped: true });
        return;
    }

    const createdMessage = buildCreatedOrderMessage({
        ...order,
        orderId,
        paymentMethod: 'wallet'
    });

    try {
        await sendTelegramMessage(createdMessage);

        const previews = extractCustomPreviewItems(order.items, 3);
        const sourceImages = extractCustomSourceImages(order.items, 8);
        const mediaFilesRaw = [
            ...previews.map((item) => item.image),
            ...sourceImages
        ];
        const mediaFiles = mediaFilesRaw.filter((item, index) => mediaFilesRaw.indexOf(item) === index);

        if (mediaFiles.length) {
            const firstTitle = previews[0]?.title || '\u041a\u0430\u0441\u0442\u043e\u043c\u043d\u0438\u0439 \u0432\u0438\u0440\u0456\u0431';
            const caption = `\uD83D\uDDBC \u041a\u0430\u0441\u0442\u043e\u043c\u043d\u0438\u0439 \u043c\u0430\u043a\u0435\u0442 \u0434\u043e \u0437\u0430\u043c\u043e\u0432\u043b\u0435\u043d\u043d\u044f ${orderId}\n${firstTitle}\n\uD83D\uDCCE \u0423\u0441\u0456 \u0444\u0430\u0439\u043b\u0438 \u0431\u0435\u0437 \u0441\u0442\u0438\u0441\u043d\u0435\u043d\u043d\u044f`;
            await sendTelegramMediaGroup(mediaFiles, caption);
        }

        globalThis.__upfPaidOrderDetailsSent.add(orderId);
        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Failed to send paid order details to Telegram.', error);
        res.status(502).json({ error: 'Failed to notify Telegram with paid order details.' });
    }
};
