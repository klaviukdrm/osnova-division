const crypto = require('crypto');

function parseUrlEncodedBody(raw) {
    if (!raw || typeof raw !== 'string') return {};
    const params = new URLSearchParams(raw);
    const payload = {};
    for (const [key, value] of params.entries()) {
        payload[key] = value;
    }
    return payload;
}

function parseRequestBody(req) {
    if (!req || req.body === undefined || req.body === null) return {};
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body !== 'string') return {};

    try {
        return JSON.parse(req.body);
    } catch (_) {
        return parseUrlEncodedBody(req.body);
    }
}

function buildSignature(privateKey, data) {
    return crypto
        .createHash('sha1')
        .update(`${privateKey}${data}${privateKey}`, 'utf8')
        .digest('base64');
}

function decodeData(data) {
    try {
        const raw = Buffer.from(String(data || ''), 'base64').toString('utf8');
        return JSON.parse(raw);
    } catch (_) {
        return null;
    }
}

function normalizeStatus(value) {
    return String(value || '').trim().toLowerCase();
}

function getStatusGroup(status) {
    const paidStatuses = new Set(['success', 'sandbox']);
    const pendingStatuses = new Set(['processing', 'wait_accept', 'wait_secure']);
    const failedStatuses = new Set(['failure', 'error', 'reversed', 'unsubscribed']);

    if (paidStatuses.has(status)) return 'paid';
    if (pendingStatuses.has(status)) return 'pending';
    if (failedStatuses.has(status)) return 'failed';
    return 'unknown';
}

module.exports = (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).send('Method not allowed');
        return;
    }

    const privateKey = process.env.LIQPAY_PRIVATE_KEY;
    if (!privateKey) {
        res.status(500).send('LiqPay private key is not configured');
        return;
    }

    const body = parseRequestBody(req);
    const data = body.data;
    const signature = body.signature;

    if (!data || !signature) {
        res.status(400).send('Missing callback payload');
        return;
    }

    const expectedSignature = buildSignature(privateKey, data);
    if (expectedSignature !== signature) {
        res.status(401).send('Invalid signature');
        return;
    }

    const payload = decodeData(data);
    if (!payload) {
        res.status(400).send('Invalid callback data');
        return;
    }

    const orderId = String(payload.order_id || '').trim();
    const amount = Number(payload.amount);
    const currency = String(payload.currency || '').trim().toUpperCase();
    const status = normalizeStatus(payload.status);
    const statusGroup = getStatusGroup(status);

    if (!orderId) {
        res.status(400).send('Missing order_id');
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        res.status(400).send('Invalid amount');
        return;
    }

    if (currency !== 'UAH') {
        res.status(400).send('Invalid currency');
        return;
    }

    if (!globalThis.__upfLiqPayProcessedEvents) {
        globalThis.__upfLiqPayProcessedEvents = new Set();
    }

    const eventKey = [
        orderId,
        status,
        String(payload.transaction_id || ''),
        String(payload.create_date || '')
    ].join(':');

    if (globalThis.__upfLiqPayProcessedEvents.has(eventKey)) {
        res.status(200).send('ok');
        return;
    }
    globalThis.__upfLiqPayProcessedEvents.add(eventKey);

    if (statusGroup === 'paid') {
        console.info('LiqPay payment confirmed', {
            order_id: orderId,
            status,
            amount,
            currency
        });
    } else if (statusGroup === 'pending') {
        console.info('LiqPay payment pending', {
            order_id: orderId,
            status,
            amount,
            currency
        });
    } else if (statusGroup === 'failed') {
        console.warn('LiqPay payment failed', {
            order_id: orderId,
            status,
            amount,
            currency
        });
    } else {
        console.warn('LiqPay payment status is unknown', {
            order_id: orderId,
            status,
            amount,
            currency
        });
    }

    res.status(200).send('ok');
};
