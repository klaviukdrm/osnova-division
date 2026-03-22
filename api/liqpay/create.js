const { buildSignature } = require('../_lib/liqpay');
const {
    generateOrderId,
    parseOrderPayload
} = require('../_lib/order-utils');

function getBaseUrl(req) {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return `${protocol}://${host}`;
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

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const publicKey = process.env.LIQPAY_PUBLIC_KEY;
    const privateKey = process.env.LIQPAY_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
        res.status(500).json({ error: 'LiqPay keys are not configured on server.' });
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

    const baseUrl = getBaseUrl(req);
    const resultUrl = process.env.LIQPAY_RESULT_URL || `${baseUrl}/payment/success`;
    const serverUrl = process.env.LIQPAY_SERVER_URL || `${baseUrl}/api/liqpay/callback`;
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
        // LiqPay can still show card flow if wallet is unavailable on device/browser.
        liqPayPayload.paytypes = 'gpay,apay,card';
    }

    const data = Buffer.from(JSON.stringify(liqPayPayload), 'utf8').toString('base64');
    const signature = buildSignature(privateKey, data);
    const checkoutUrl = `https://www.liqpay.ua/api/3/checkout?data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}`;

    res.status(200).json({
        orderId,
        data,
        signature,
        checkoutUrl
    });
};
