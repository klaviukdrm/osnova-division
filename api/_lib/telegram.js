const https = require('https');

function postJson(url, payload) {
    return new Promise((resolve, reject) => {
        const target = new URL(url);
        const body = JSON.stringify(payload);

        const req = https.request(
            {
                protocol: target.protocol,
                hostname: target.hostname,
                port: target.port || 443,
                path: `${target.pathname}${target.search}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
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
                    let parsed = null;
                    try {
                        parsed = raw ? JSON.parse(raw) : null;
                    } catch (_) {
                        parsed = null;
                    }

                    resolve({
                        ok: res.statusCode >= 200 && res.statusCode < 300,
                        statusCode: res.statusCode || 0,
                        data: parsed,
                        raw
                    });
                });
            }
        );

        req.setTimeout(12000, () => {
            req.destroy(new Error('Telegram request timeout'));
        });

        req.on('error', (error) => reject(error));
        req.write(body);
        req.end();
    });
}

function getTelegramConfig() {
    const token = String(process.env.TELEGRAM_BOT_TOKEN || '').trim();
    const chatId = String(process.env.TELEGRAM_ADMIN_CHAT_ID || '').trim();
    const threadIdRaw = String(process.env.TELEGRAM_THREAD_ID || '').trim();

    if (!token || !chatId) {
        return {
            valid: false,
            error: 'Telegram env is not configured. TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID are required.'
        };
    }

    const threadId = Number(threadIdRaw);
    return {
        valid: true,
        token,
        chatId,
        threadId: Number.isFinite(threadId) && threadId > 0 ? threadId : null
    };
}

async function sendTelegramMessage(text) {
    const config = getTelegramConfig();
    if (!config.valid) {
        const error = new Error(config.error);
        error.code = 'TELEGRAM_ENV_MISSING';
        throw error;
    }

    const payload = {
        chat_id: config.chatId,
        text: String(text || '').slice(0, 4000),
        disable_web_page_preview: true
    };

    if (config.threadId) {
        payload.message_thread_id = config.threadId;
    }

    const url = `https://api.telegram.org/bot${config.token}/sendMessage`;
    const response = await postJson(url, payload);

    if (!response.ok || !response.data?.ok) {
        const reason = response.data?.description || response.raw || `HTTP ${response.statusCode}`;
        const error = new Error(`Telegram sendMessage failed: ${reason}`);
        error.code = 'TELEGRAM_SEND_FAILED';
        throw error;
    }

    return response.data.result;
}

module.exports = {
    sendTelegramMessage
};
