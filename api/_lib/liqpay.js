const crypto = require('crypto');
const https = require('https');

function buildSignature(privateKey, data) {
    return crypto
        .createHash('sha1')
        .update(`${privateKey}${data}${privateKey}`, 'utf8')
        .digest('base64');
}

function postForm(url, formBody) {
    return new Promise((resolve, reject) => {
        const target = new URL(url);
        const body = String(formBody || '');

        const req = https.request(
            {
                protocol: target.protocol,
                hostname: target.hostname,
                port: target.port || 443,
                path: `${target.pathname}${target.search}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Content-Length': Buffer.byteLength(body, 'utf8')
                }
            },
            (res) => {
                let raw = '';
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    raw += chunk;
                });
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode || 0,
                        raw
                    });
                });
            }
        );

        req.setTimeout(12000, () => {
            req.destroy(new Error('LiqPay request timeout'));
        });

        req.on('error', (error) => reject(error));
        req.write(body);
        req.end();
    });
}

async function fetchLiqPayPaymentStatus({ publicKey, privateKey, orderId }) {
    const safePublicKey = String(publicKey || '').trim();
    const safePrivateKey = String(privateKey || '').trim();
    const safeOrderId = String(orderId || '').trim();

    if (!safePublicKey || !safePrivateKey || !safeOrderId) {
        return null;
    }

    const payload = {
        action: 'status',
        version: '3',
        public_key: safePublicKey,
        order_id: safeOrderId
    };

    const data = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
    const signature = buildSignature(safePrivateKey, data);
    const body = `data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}`;

    const response = await postForm('https://www.liqpay.ua/api/request', body);
    if (response.statusCode < 200 || response.statusCode >= 300) {
        return null;
    }

    try {
        const parsed = JSON.parse(response.raw || '{}');
        if (!parsed || typeof parsed !== 'object') return null;
        return parsed;
    } catch (_) {
        return null;
    }
}

module.exports = {
    buildSignature,
    fetchLiqPayPaymentStatus
};
