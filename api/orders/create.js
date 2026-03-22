const { sendTelegramMessage } = require('../_lib/telegram');
const {
    generateOrderId,
    parseOrderPayload,
    buildCreatedOrderMessage
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
    const text = buildCreatedOrderMessage({
        ...order,
        orderId,
        paymentMethod: 'invoice'
    });

    try {
        await sendTelegramMessage(text);
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
