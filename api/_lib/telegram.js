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

function postMultipart(url, parts) {
    return new Promise((resolve, reject) => {
        const target = new URL(url);
        const boundary = `----upfBoundary${Date.now()}${Math.random().toString(16).slice(2)}`;
        const buffers = [];

        parts.forEach((part) => {
            buffers.push(Buffer.from(`--${boundary}\r\n`, 'utf8'));
            if (part.filename) {
                buffers.push(
                    Buffer.from(
                        `Content-Disposition: form-data; name="${part.name}"; filename="${part.filename}"\r\n`,
                        'utf8'
                    )
                );
                buffers.push(Buffer.from(`Content-Type: ${part.contentType || 'application/octet-stream'}\r\n\r\n`, 'utf8'));
                buffers.push(Buffer.isBuffer(part.data) ? part.data : Buffer.from(String(part.data || ''), 'utf8'));
                buffers.push(Buffer.from('\r\n', 'utf8'));
            } else {
                buffers.push(Buffer.from(`Content-Disposition: form-data; name="${part.name}"\r\n\r\n`, 'utf8'));
                buffers.push(Buffer.from(String(part.data ?? ''), 'utf8'));
                buffers.push(Buffer.from('\r\n', 'utf8'));
            }
        });

        buffers.push(Buffer.from(`--${boundary}--\r\n`, 'utf8'));
        const body = Buffer.concat(buffers);

        const req = https.request(
            {
                protocol: target.protocol,
                hostname: target.hostname,
                port: target.port || 443,
                path: `${target.pathname}${target.search}`,
                method: 'POST',
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                    'Content-Length': body.length
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

        req.setTimeout(15000, () => {
            req.destroy(new Error('Telegram multipart request timeout'));
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

function parseImageDataUrl(imageDataUrl) {
    const value = String(imageDataUrl || '').trim();
    const match = value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\r\n]+)$/);
    if (!match) return null;

    const mimeType = match[1].toLowerCase();
    const base64 = match[2].replace(/\s+/g, '');
    const data = Buffer.from(base64, 'base64');
    if (!data.length) return null;

    let extension = 'bin';
    if (mimeType === 'image/png') extension = 'png';
    if (mimeType === 'image/jpeg') extension = 'jpg';
    if (mimeType === 'image/webp') extension = 'webp';
    if (mimeType === 'image/gif') extension = 'gif';

    return { mimeType, data, extension };
}

async function sendTelegramPhoto(photo, caption = '') {
    const config = getTelegramConfig();
    if (!config.valid) {
        const error = new Error(config.error);
        error.code = 'TELEGRAM_ENV_MISSING';
        throw error;
    }

    const textCaption = String(caption || '').slice(0, 1024);
    const photoValue = String(photo || '').trim();
    const apiUrl = `https://api.telegram.org/bot${config.token}/sendPhoto`;

    // URL mode for remote images.
    if (/^https?:\/\//i.test(photoValue)) {
        const payload = {
            chat_id: config.chatId,
            photo: photoValue
        };

        if (textCaption) payload.caption = textCaption;
        if (config.threadId) payload.message_thread_id = config.threadId;

        const response = await postJson(apiUrl, payload);
        if (!response.ok || !response.data?.ok) {
            const reason = response.data?.description || response.raw || `HTTP ${response.statusCode}`;
            const error = new Error(`Telegram sendPhoto failed: ${reason}`);
            error.code = 'TELEGRAM_SEND_PHOTO_FAILED';
            throw error;
        }
        return response.data.result;
    }

    // Data URL mode for constructor previews.
    const parsed = parseImageDataUrl(photoValue);
    if (!parsed) {
        const error = new Error('Unsupported photo format. Expected http(s) URL or data:image base64.');
        error.code = 'TELEGRAM_PHOTO_FORMAT_UNSUPPORTED';
        throw error;
    }

    const parts = [
        { name: 'chat_id', data: config.chatId }
    ];

    if (config.threadId) {
        parts.push({ name: 'message_thread_id', data: String(config.threadId) });
    }
    if (textCaption) {
        parts.push({ name: 'caption', data: textCaption });
    }

    parts.push({
        name: 'photo',
        filename: `order-preview.${parsed.extension}`,
        contentType: parsed.mimeType,
        data: parsed.data
    });

    const response = await postMultipart(apiUrl, parts);
    if (!response.ok || !response.data?.ok) {
        const reason = response.data?.description || response.raw || `HTTP ${response.statusCode}`;
        const error = new Error(`Telegram sendPhoto failed: ${reason}`);
        error.code = 'TELEGRAM_SEND_PHOTO_FAILED';
        throw error;
    }

    return response.data.result;
}

module.exports = {
    sendTelegramMessage,
    sendTelegramPhoto
};
