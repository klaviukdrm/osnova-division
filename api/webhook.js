const sgMail = require('@sendgrid/mail');
const { getOrderById, updateOrderById } = require('./_lib/order-store');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

let isSendGridConfigured = false;

function configureSendGrid() {
    if (isSendGridConfigured) return;
    if (!SENDGRID_API_KEY) {
        throw new Error('SENDGRID_API_KEY is not configured');
    }
    sgMail.setApiKey(SENDGRID_API_KEY);
    isSendGridConfigured = true;
}

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

async function sendOrderSuccessEmail(toEmail) {
    try {
        configureSendGrid();

        const fromEmail = String(SENDGRID_FROM_EMAIL || '').trim();
        if (!fromEmail) {
            throw new Error('SENDGRID_FROM_EMAIL is not configured');
        }

        const msg = {
            to: toEmail,
            from: {
                email: fromEmail,
                name: 'PrintFamily'
            },
            subject: 'Замовлення оформлене',
            text: 'Ваше замовлення оформлене, очікуйте доставку протягом 3-5 робочих днів'
        };

        await sgMail.send(msg);
    } catch (error) {
        throw new Error(`SendGrid send failed: ${error?.message || error}`);
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

        const savedEmail = String(order?.email || '').trim();
        if (!savedEmail) {
            res.status(400).json({
                ok: false,
                error: 'Order email is missing in stored order'
            });
            return;
        }

        if (String(order?.emailSentAt || '').trim()) {
            await updateOrderById(orderId, { status: 'success' }).catch(() => null);
            res.status(200).json({
                ok: true,
                emailed: true,
                alreadySent: true
            });
            return;
        }

        await sendOrderSuccessEmail(savedEmail);
        await updateOrderById(orderId, {
            status: 'success',
            emailSentAt: new Date().toISOString()
        }).catch(() => null);

        res.status(200).json({
            ok: true,
            emailed: true,
            orderId
        });
    } catch (error) {
        console.error('Webhook email error:', error?.message || error);
        res.status(500).json({
            ok: false,
            error: 'Failed to process webhook or send email'
        });
    }
};
