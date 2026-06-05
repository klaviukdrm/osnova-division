const DEFAULT_BUCKET = 'products';
const DEFAULT_MAX_UPLOAD_BYTES = 500 * 1024 * 1024;

const IMAGE_FILE_EXTENSIONS = new Set([
    'jpg',
    'jpeg',
    'jfif',
    'pjpeg',
    'pjp',
    'png',
    'webp',
    'gif',
    'bmp',
    'avif',
    'heic',
    'heif',
    'tif',
    'tiff',
    'svg',
    'ico'
]);

function sendJson(res, statusCode, payload) {
    res.status(statusCode).json(payload);
}

function getHeader(req, name) {
    const headers = req?.headers || {};
    const value = headers[name] || headers[name.toLowerCase()] || headers[name.toUpperCase()];
    if (Array.isArray(value)) return value[0] || '';
    return String(value || '');
}

function decodeHeaderValue(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    try {
        return decodeURIComponent(raw);
    } catch (_) {
        return raw;
    }
}

function getSupabaseConfig() {
    const url = String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
    const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
    const bucket = String(
        process.env.SUPABASE_ORDER_STORAGE_BUCKET
        || process.env.SUPABASE_STORAGE_BUCKET
        || DEFAULT_BUCKET
    ).trim() || DEFAULT_BUCKET;
    const maxUploadBytesRaw = Number(process.env.SUPABASE_MAX_UPLOAD_BYTES || DEFAULT_MAX_UPLOAD_BYTES);
    const maxUploadBytes = Number.isFinite(maxUploadBytesRaw) && maxUploadBytesRaw > 0
        ? Math.floor(maxUploadBytesRaw)
        : DEFAULT_MAX_UPLOAD_BYTES;
    return { url, key, bucket, maxUploadBytes };
}

function extensionFromFileName(fileName) {
    return String(fileName || '').toLowerCase().match(/\.([a-z0-9]{2,8})$/)?.[1] || '';
}

function inferMimeType(fileName, contentType) {
    const normalizedType = String(contentType || '').trim().toLowerCase();
    const extension = extensionFromFileName(fileName);
    if (extension === 'jpg' || extension === 'jpeg' || extension === 'jfif' || extension === 'pjpeg' || extension === 'pjp') return 'image/jpeg';
    if (extension === 'png') return 'image/png';
    if (extension === 'webp') return 'image/webp';
    if (extension === 'gif') return 'image/gif';
    if (extension === 'bmp') return 'image/bmp';
    if (extension === 'avif') return 'image/avif';
    if (extension === 'heic') return 'image/heic';
    if (extension === 'heif') return 'image/heif';
    if (extension === 'tif' || extension === 'tiff') return 'image/tiff';
    if (extension === 'svg') return 'image/svg+xml';
    if (extension === 'ico') return 'image/x-icon';
    if (normalizedType === 'image/jpg' || normalizedType === 'image/pjpeg' || normalizedType === 'image/jfif') return 'image/jpeg';
    return normalizedType.startsWith('image/') ? normalizedType : 'application/octet-stream';
}

function isAllowedImage(fileName, mimeType) {
    const normalizedType = String(mimeType || '').trim().toLowerCase();
    if (normalizedType.startsWith('image/')) return true;
    return IMAGE_FILE_EXTENSIONS.has(extensionFromFileName(fileName));
}

function sanitizePathPart(value, fallback = 'file') {
    const safe = String(value || '')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
    return safe || fallback;
}

function sanitizeFolder(value) {
    const raw = String(value || '').trim().replace(/\\/g, '/');
    return raw
        .split('/')
        .map((part) => sanitizePathPart(part, ''))
        .filter(Boolean)
        .slice(0, 6)
        .join('/') || 'uploads';
}

function extensionFromMimeType(mimeType, fileName) {
    const fallbackExtension = extensionFromFileName(fileName);
    if (fallbackExtension) return fallbackExtension;
    const normalized = String(mimeType || '').toLowerCase();
    if (normalized === 'image/png') return 'png';
    if (normalized === 'image/webp') return 'webp';
    if (normalized === 'image/gif') return 'gif';
    if (normalized === 'image/bmp') return 'bmp';
    if (normalized === 'image/avif') return 'avif';
    if (normalized === 'image/heic') return 'heic';
    if (normalized === 'image/heif') return 'heif';
    if (normalized === 'image/tiff') return 'tiff';
    if (normalized === 'image/svg+xml') return 'svg';
    if (normalized === 'image/x-icon' || normalized === 'image/vnd.microsoft.icon') return 'ico';
    return 'jpg';
}

function buildObjectPath({ folder, fileName, mimeType }) {
    const dateFolder = new Date().toISOString().slice(0, 10);
    const extension = extensionFromMimeType(mimeType, fileName);
    const stem = sanitizePathPart(String(fileName || '').replace(/\.[^.]+$/, ''), 'upload');
    const random = Math.random().toString(36).slice(2, 10);
    return `${sanitizeFolder(folder)}/${dateFolder}/${Date.now()}-${random}-${stem}.${extension}`;
}

function encodeObjectPath(path) {
    return String(path || '')
        .split('/')
        .map((part) => encodeURIComponent(part))
        .join('/');
}

function formatBytes(bytes) {
    const value = Number(bytes || 0);
    if (!Number.isFinite(value) || value <= 0) return '0B';
    if (value < 1024) return `${Math.ceil(value)}B`;
    if (value < 1024 * 1024) return `${Math.ceil(value / 1024)}KB`;
    return `${Math.ceil(value / 1024 / 1024)}MB`;
}

function readRawBody(req, limitBytes) {
    if (Buffer.isBuffer(req?.body)) return Promise.resolve(req.body);
    if (typeof req?.body === 'string') return Promise.resolve(Buffer.from(req.body, 'binary'));

    return new Promise((resolve, reject) => {
        const chunks = [];
        let total = 0;

        req.on('data', (chunk) => {
            const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            total += buffer.length;
            if (total > limitBytes) {
                reject(new Error('file_too_large'));
                req.destroy();
                return;
            }
            chunks.push(buffer);
        });

        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
    }

    const config = getSupabaseConfig();
    if (!config.url || !config.key) {
        sendJson(res, 500, {
            error: 'SUPABASE_URL та SUPABASE_SERVICE_ROLE_KEY або SUPABASE_ANON_KEY не налаштовані.'
        });
        return;
    }

    const fileName = decodeHeaderValue(getHeader(req, 'x-file-name')) || 'upload.jpg';
    const folder = decodeHeaderValue(getHeader(req, 'x-upload-folder')) || 'uploads';
    const mimeType = inferMimeType(fileName, getHeader(req, 'content-type'));

    if (!isAllowedImage(fileName, mimeType)) {
        sendJson(res, 400, { error: 'Підтримуються тільки зображення.' });
        return;
    }

    let buffer;
    try {
        buffer = await readRawBody(req, config.maxUploadBytes);
    } catch (error) {
        if (error?.message === 'file_too_large') {
            sendJson(res, 413, {
                error: `Файл занадто великий. Максимум ${formatBytes(config.maxUploadBytes)}.`
            });
            return;
        }
        console.error('Failed to read upload body.', error);
        sendJson(res, 400, { error: 'Не вдалося прочитати файл.' });
        return;
    }

    if (!buffer.length) {
        sendJson(res, 400, { error: 'Файл порожній.' });
        return;
    }

    const objectPath = buildObjectPath({ folder, fileName, mimeType });
    const encodedObjectPath = encodeObjectPath(objectPath);
    const uploadUrl = `${config.url}/storage/v1/object/${encodeURIComponent(config.bucket)}/${encodedObjectPath}`;

    try {
        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                apikey: config.key,
                Authorization: `Bearer ${config.key}`,
                'Content-Type': mimeType,
                'cache-control': 'max-age=3600',
                'x-upsert': 'false'
            },
            body: buffer
        });

        const text = await uploadResponse.text();
        let payload;
        try {
            payload = text ? JSON.parse(text) : null;
        } catch (_) {
            payload = text;
        }

        if (!uploadResponse.ok) {
            const message = typeof payload === 'string'
                ? payload
                : (payload?.message || payload?.error || `Supabase Storage error ${uploadResponse.status}`);
            sendJson(res, uploadResponse.status, { error: `Не вдалося завантажити файл: ${message}` });
            return;
        }

        const publicUrl = `${config.url}/storage/v1/object/public/${encodeURIComponent(config.bucket)}/${encodedObjectPath}`;
        sendJson(res, 200, {
            ok: true,
            bucket: config.bucket,
            path: objectPath,
            publicUrl
        });
    } catch (error) {
        console.error('Failed to upload image through server fallback.', error);
        sendJson(res, 502, { error: 'Помилка при завантаженні у Supabase Storage.' });
    }
};
