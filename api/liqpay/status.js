const { fetchLiqPayPaymentStatus } = require('../_lib/liqpay');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const publicKey = String(process.env.LIQPAY_PUBLIC_KEY || '').trim();
    const privateKey = String(process.env.LIQPAY_PRIVATE_KEY || '').trim();
    if (!publicKey || !privateKey) {
        res.status(500).json({ error: 'LiqPay keys are not configured on server.' });
        return;
    }

    const orderId = String(req.query?.orderId || '').trim();
    if (!orderId) {
        res.status(400).json({ error: 'orderId is required.' });
        return;
    }

    try {
        const statusPayload = await fetchLiqPayPaymentStatus({
            publicKey,
            privateKey,
            orderId
        });

        if (!statusPayload || typeof statusPayload !== 'object') {
            res.status(404).json({ error: 'Payment status not found.' });
            return;
        }

        const status = String(statusPayload.status || '').trim().toLowerCase();
        res.status(200).json({
            ok: true,
            orderId,
            status
        });
    } catch (error) {
        console.error('Failed to fetch LiqPay payment status.', error);
        res.status(502).json({ error: 'Failed to fetch LiqPay payment status.' });
    }
};
