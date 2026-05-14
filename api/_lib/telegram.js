const https = require('https');
const TELEGRAM_MEDIA_GROUP_LIMIT = 10;

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

function getFileExtensionFromMimeType(mimeType) {
    const normalized = String(mimeType || '').toLowerCase();
    if (!normalized) return 'bin';
    if (normalized === 'image/jpeg') return 'jpg';
    if (normalized === 'image/svg+xml') return 'svg';
    if (normalized === 'image/x-icon' || normalized === 'image/vnd.microsoft.icon') return 'ico';

    const slashIndex = normalized.indexOf('/');
    if (slashIndex < 0) return 'bin';
    const subtype = normalized.slice(slashIndex + 1);
    const extension = subtype.split('+')[0].split(';')[0].trim().replace(/[^a-z0-9.-]/g, '');
    return extension || 'bin';
}

function parseBase64DataUrl(dataUrl) {
    const value = String(dataUrl || '').trim();
    const match = value.match(/^data:([^;,]+)(?:;[^,]*)?;base64,([A-Za-z0-9+/=\r\n]+)$/);
    if (!match) return null;

    const mimeType = String(match[1] || '').toLowerCase().trim();
    const base64 = String(match[2] || '').replace(/\s+/g, '');
    if (!mimeType || !base64) return null;

    const data = Buffer.from(base64, 'base64');
    if (!data.length) return null;

    return {
        mimeType,
        data,
        extension: getFileExtensionFromMimeType(mimeType)
    };
}

function parseImageDataUrl(imageDataUrl) {
    const parsed = parseBase64DataUrl(imageDataUrl);
    if (!parsed || !parsed.mimeType.startsWith('image/')) return null;
    return parsed;
}

async function sendTelegramPhoto(photo, caption = '', customFilename = null) {
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
        filename: customFilename || `order-preview.${parsed.extension}`,
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

async function sendTelegramDocument(documentFile, caption = '', customFilename = null) {
    const config = getTelegramConfig();
    if (!config.valid) {
        const error = new Error(config.error);
        error.code = 'TELEGRAM_ENV_MISSING';
        throw error;
    }

    const textCaption = String(caption || '').slice(0, 1024);
    const documentValue = String(documentFile || '').trim();
    const apiUrl = `https://api.telegram.org/bot${config.token}/sendDocument`;

    if (/^https?:\/\//i.test(documentValue)) {
        const payload = {
            chat_id: config.chatId,
            document: documentValue
        };

        if (textCaption) payload.caption = textCaption;
        if (config.threadId) payload.message_thread_id = config.threadId;

        const response = await postJson(apiUrl, payload);
        if (!response.ok || !response.data?.ok) {
            const reason = response.data?.description || response.raw || `HTTP ${response.statusCode}`;
            const error = new Error(`Telegram sendDocument failed: ${reason}`);
            error.code = 'TELEGRAM_SEND_DOCUMENT_FAILED';
            throw error;
        }
        return response.data.result;
    }

    const parsed = parseBase64DataUrl(documentValue);
    if (!parsed) {
        const error = new Error('Unsupported document format. Expected http(s) URL or data:*;base64 payload.');
        error.code = 'TELEGRAM_DOCUMENT_FORMAT_UNSUPPORTED';
        throw error;
    }

    const parts = [{ name: 'chat_id', data: config.chatId }];

    if (config.threadId) {
        parts.push({ name: 'message_thread_id', data: String(config.threadId) });
    }
    if (textCaption) {
        parts.push({ name: 'caption', data: textCaption });
    }

    parts.push({
        name: 'document',
        filename: customFilename || `order-file.${parsed.extension}`,
        contentType: parsed.mimeType,
        data: parsed.data
    });

    const response = await postMultipart(apiUrl, parts);
    if (!response.ok || !response.data?.ok) {
        const reason = response.data?.description || response.raw || `HTTP ${response.statusCode}`;
        const error = new Error(`Telegram sendDocument failed: ${reason}`);
        error.code = 'TELEGRAM_SEND_DOCUMENT_FAILED';
        throw error;
    }

    return response.data.result;
}

async function sendTelegramMediaGroupChunk(files, caption = '') {
    const config = getTelegramConfig();
    if (!config.valid) {
        const error = new Error(config.error);
        error.code = 'TELEGRAM_ENV_MISSING';
        throw error;
    }

    const list = (Array.isArray(files) ? files : [])
        .map((value) => String(value || '').trim())
        .filter(Boolean);

    if (!list.length) return null;
    if (list.length === 1) {
        return sendTelegramDocument(list[0], caption);
    }

    const textCaption = String(caption || '').slice(0, 1024);
    const apiUrl = `https://api.telegram.org/bot${config.token}/sendMediaGroup`;
    const parts = [{ name: 'chat_id', data: config.chatId }];
    const media = [];
    const preparedFiles = [];

    if (config.threadId) {
        parts.push({ name: 'message_thread_id', data: String(config.threadId) });
    }

    list.forEach((item, index) => {
        const withCaption = index === 0 && textCaption;
        if (/^https?:\/\//i.test(item)) {
            preparedFiles.push(item);
            media.push({
                type: 'document',
                media: item,
                ...(withCaption ? { caption: textCaption } : {})
            });
            return;
        }

        const parsed = parseBase64DataUrl(item);
        if (!parsed) return;

        const attachName = `file${index}`;
        preparedFiles.push(item);
        media.push({
            type: 'document',
            media: `attach://${attachName}`,
            ...(withCaption ? { caption: textCaption } : {})
        });
        parts.push({
            name: attachName,
            filename: `order-file-${index + 1}.${parsed.extension}`,
            contentType: parsed.mimeType,
            data: parsed.data
        });
    });

    if (!media.length) return null;
    if (media.length === 1 && preparedFiles.length === 1) {
        return sendTelegramDocument(preparedFiles[0], textCaption);
    }

    parts.push({
        name: 'media',
        data: JSON.stringify(media)
    });

    const response = await postMultipart(apiUrl, parts);
    if (response.ok && response.data?.ok) {
        return response.data.result;
    }

    const reason = response.data?.description || response.raw || `HTTP ${response.statusCode}`;
    const error = new Error(`Telegram sendMediaGroup failed: ${reason}`);
    error.code = 'TELEGRAM_SEND_MEDIA_GROUP_FAILED';

    // Fallback: if media group fails, try to deliver files one by one.
    const fallbackResults = [];
    let fallbackCaption = textCaption;
    let fallbackSucceeded = false;

    for (const file of preparedFiles) {
        try {
            const singleResult = await sendTelegramDocument(file, fallbackCaption);
            fallbackCaption = '';
            fallbackSucceeded = true;
            fallbackResults.push(singleResult);
        } catch (_) {}
    }

    if (fallbackSucceeded) {
        return fallbackResults;
    }

    throw error;
}

async function sendTelegramMediaGroup(files, caption = '') {
    const list = (Array.isArray(files) ? files : [])
        .map((value) => String(value || '').trim())
        .filter(Boolean);

    if (!list.length) return null;
    if (list.length === 1) {
        return sendTelegramDocument(list[0], caption);
    }

    const results = [];
    let pendingCaption = String(caption || '');

    for (let startIndex = 0; startIndex < list.length; startIndex += TELEGRAM_MEDIA_GROUP_LIMIT) {
        const chunk = list.slice(startIndex, startIndex + TELEGRAM_MEDIA_GROUP_LIMIT);
        if (!chunk.length) continue;

        const chunkCaption = pendingCaption;
        pendingCaption = '';

        const chunkResult = await sendTelegramMediaGroupChunk(chunk, chunkCaption);
        if (!chunkResult) continue;
        if (Array.isArray(chunkResult)) {
            results.push(...chunkResult);
        } else {
            results.push(chunkResult);
        }
    }

    return results;
}

module.exports = {
    sendTelegramMessage,
    sendTelegramPhoto,
    sendTelegramDocument,
    sendTelegramMediaGroup
};
