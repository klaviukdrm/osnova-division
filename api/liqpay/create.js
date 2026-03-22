const { sendTelegramMessage, sendTelegramMediaGroup } = require('../_lib/telegram');
const { buildSignature } = require('../_lib/liqpay');
const {
    generateOrderId,
    parseOrderPayload,
    buildCreatedOrderMessage,
    extractCustomPreviewItems,
    extractCustomSourceImages
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
            try {
                await sendTelegramMediaGroup(mediaFiles, caption);
            } catch (previewError) {
                console.warn('Failed to send constructor media group to Telegram.', previewError);
            }
        }
    } catch (error) {
        console.error('Failed to notify Telegram about created LiqPay order.', error);
        res.status(502).json({ error: 'Failed to send order to Telegram. Check bot/chat configuration.' });
        return;
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
