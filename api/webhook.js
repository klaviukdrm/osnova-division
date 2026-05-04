const {
    getOrderById,
    updateOrderById,
    claimOrderForSms,
    markSmsSent,
    releaseSmsClaim
} = require('./_lib/order-store');
const { normalizePhoneE164 } = require('./_lib/order-utils');

const TURBOSMS_TOKEN = process.env.TURBOSMS_TOKEN;
const TURBOSMS_SENDER = process.env.TURBOSMS_SENDER;

function toPlainObjectBody(body) {
    if (!body) return {};
    if (typeof body === 'object') return body;
    if (typeof body === 'string') {
        try {
            return JSON.parse(body);
        } catch (_) {
            const params = new URLSearchParams(body);
            const parsed = {};
            for (const [key, value] of params.entries()) {
                parsed[key] = value;
            }
            return parsed;
        }
    }
    return {};
}

async function sendOrderSuccessSms(phone) {
    const token = String(TURBOSMS_TOKEN || '').trim();
    const sender = String(TURBOSMS_SENDER || '').trim();
    if (!token) {
        throw new Error('TURBOSMS_TOKEN is not configured');
    }
    if (!sender) {
        throw new Error('TURBOSMS_SENDER is not configured');
    }

    const response = await fetch('https://api.turbosms.ua/message/send.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            recipients: [phone],
            sms: {
                sender,
                text: 'Ваш заказ оформлен ✅ Ожидайте доставку'
            }
        })
    });

    const rawBody = await response.text();
    let parsedBody = null;
    try {
        parsedBody = rawBody ? JSON.parse(rawBody) : null;
    } catch (_) {
        parsedBody = null;
    }

    const responseCode = Number(parsedBody?.response_code);
    if (!response.ok || (Number.isFinite(responseCode) && responseCode !== 0)) {
        throw new Error(`TurboSMS API error: status=${response.status}, body=${rawBody || '<empty>'}`);
    }
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const body = toPlainObjectBody(req.body);
        const status = String(body?.status || '').trim().toLowerCase();
        const orderId = String(
            body?.orderId
            || body?.order_id
            || body?.id
            || ''
        ).trim();

        if (!status || !orderId) {
            res.status(400).json({ error: 'Fields "status" and "orderId" (or "order_id") are required' });
            return;
        }

        if (status !== 'success') {
            await updateOrderById(orderId, { status }).catch(() => null);
            res.status(200).json({
                ok: true,
                skipped: true,
                reason: 'Payment status is not success'
            });
            return;
        }

        const order = await getOrderById(orderId);
        if (!order) {
            res.status(404).json({
                ok: false,
                error: 'Order not found'
            });
            return;
        }

        const normalizedPhone = normalizePhoneE164(order?.phone);
        if (!normalizedPhone) {
            await updateOrderById(orderId, { status: 'success' }).catch(() => null);
            res.status(200).json({
                ok: true,
                orderId,
                smsSent: false,
                smsSkipped: true
            });
            return;
        }

        const claimedOrder = await claimOrderForSms(orderId);
        if (!claimedOrder) {
            const freshOrder = await getOrderById(orderId).catch(() => null);
            res.status(200).json({
                ok: true,
                orderId,
                alreadySent: Boolean(String(freshOrder?.smsSentAt || '').trim()),
                smsSent: Boolean(String(freshOrder?.smsSentAt || '').trim())
            });
            return;
        }

        try {
            await sendOrderSuccessSms(normalizedPhone);
            await markSmsSent(orderId);
            res.status(200).json({
                ok: true,
                orderId,
                smsSent: true
            });
            return;
        } catch (smsError) {
            await releaseSmsClaim(orderId).catch(() => null);
            console.error('Failed to send TurboSMS message:', smsError?.message || smsError);
            res.status(200).json({
                ok: true,
                orderId,
                smsSent: false,
                smsError: 'Failed to send SMS'
            });
            return;
        }
    } catch (error) {
        console.error('Webhook processing error:', error?.message || error);
        res.status(500).json({
            ok: false,
            error: 'Failed to process webhook'
        });
    }
};
