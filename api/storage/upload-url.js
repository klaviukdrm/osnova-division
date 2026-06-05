const DEFAULT_BUCKET = 'products';
const DEFAULT_MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/pjpeg',
    'image/jfif',
    'image/png',
    'image/x-png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/x-ms-bmp',
    'image/avif',
    'image/heic',
    'image/heif',
    'image/tiff',
    'image/svg+xml',
    'image/x-icon',
    'image/vnd.microsoft.icon'
]);

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

function readBody(req) {
    if (!req || req.body === undefined || req.body === null) return {};
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body !== 'string') return {};
    try {
        return JSON.parse(req.body);
    } catch (_) {
        return {};
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

function extensionFromMimeType(mimeType, fallbackName = '') {
    const normalized = String(mimeType || '').toLowerCase();
    const fallbackExtension = String(fallbackName || '').toLowerCase().match(/\.([a-z0-9]{2,8})$/)?.[1] || '';
    if (fallbackExtension) return fallbackExtension;
    if (normalized === 'image/jpeg' || normalized === 'image/jpg' || normalized === 'image/pjpeg' || normalized === 'image/jfif') return 'jpg';
    if (normalized === 'image/png') return 'png';
    if (normalized === 'image/webp') return 'webp';
    if (normalized === 'image/gif') return 'gif';
    if (normalized === 'image/bmp') return 'bmp';
    if (normalized === 'image/avif') return 'avif';
    if (normalized === 'image/heic') return 'heic';
    if (normalized === 'image/heif') return 'heif';
    if (normalized === 'image/tiff') return 'tiff';
    if (normalized === 'image/svg+xml') return 'svg';
    return 'jpg';
}

function inferMimeTypeFromFileName(fileName) {
    const extension = String(fileName || '').toLowerCase().match(/\.([a-z0-9]{2,8})$/)?.[1] || '';
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
    return '';
}

function isAllowedImageUpload(mimeType, fileName) {
    const normalizedMimeType = String(mimeType || '').trim().toLowerCase();
    if (ALLOWED_MIME_TYPES.has(normalizedMimeType)) return true;
    if (normalizedMimeType.startsWith('image/')) return true;

    const extension = String(fileName || '').toLowerCase().match(/\.([a-z0-9]{2,8})$/)?.[1] || '';
    return IMAGE_FILE_EXTENSIONS.has(extension);
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

function buildObjectPath({ folder, fileName, mimeType }) {
    const now = new Date();
    const dateFolder = now.toISOString().slice(0, 10);
    const extension = extensionFromMimeType(mimeType, fileName);
    const stem = sanitizePathPart(String(fileName || '').replace(/\.[^.]+$/, ''), 'upload');
    const random = Math.random().toString(36).slice(2, 10);
    const safeFolder = sanitizeFolder(folder || 'uploads');
    return `${safeFolder}/${dateFolder}/${Date.now()}-${random}-${stem}.${extension}`;
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

async function requestSignedUploadUrl(config, objectPath) {
    const storageBaseUrl = `${config.url}/storage/v1`;
    const endpoint = `${storageBaseUrl}/object/upload/sign/${encodeURIComponent(config.bucket)}/${encodeObjectPath(objectPath)}`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            apikey: config.key,
            Authorization: `Bearer ${config.key}`,
            'Content-Type': 'application/json',
            'x-upsert': 'false'
        },
        body: '{}'
    });

    const text = await response.text();
    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch (_) {
        data = text;
    }

    if (!response.ok) {
        const message = typeof data === 'string'
            ? data
            : (data?.message || data?.error || `Supabase Storage error ${response.status}`);
        const error = new Error(message);
        error.status = response.status;
        error.details = data;
        throw error;
    }

    const relativeSignedUrl = data?.url || data?.signedURL || data?.signedUrl || '';
    const signedUrl = /^https?:\/\//i.test(relativeSignedUrl)
        ? relativeSignedUrl
        : `${storageBaseUrl}${String(relativeSignedUrl || '')}`;
    const token = (() => {
        try {
            return new URL(signedUrl).searchParams.get('token') || '';
        } catch (_) {
            return '';
        }
    })();

    if (!signedUrl || !token) {
        throw new Error('Supabase did not return a valid signed upload URL.');
    }

    return { signedUrl, token };
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

    const body = readBody(req);
    const mimeType = String(body?.contentType || inferMimeTypeFromFileName(body?.fileName) || '').trim().toLowerCase();
    const fileSize = Number(body?.size || 0);

    if (!isAllowedImageUpload(mimeType, body?.fileName)) {
        sendJson(res, 400, { error: 'Підтримуються тільки зображення.' });
        return;
    }

    if (Number.isFinite(fileSize) && fileSize > config.maxUploadBytes) {
        sendJson(res, 413, {
            error: `Файл занадто великий. Максимум ${formatBytes(config.maxUploadBytes)}.`
        });
        return;
    }

    const objectPath = buildObjectPath({
        folder: body?.folder,
        fileName: body?.fileName,
        mimeType
    });
    const encodedObjectPath = encodeObjectPath(objectPath);

    try {
        const signed = await requestSignedUploadUrl(config, objectPath);
        const publicUrl = `${config.url}/storage/v1/object/public/${encodeURIComponent(config.bucket)}/${encodedObjectPath}`;
        sendJson(res, 200, {
            ok: true,
            bucket: config.bucket,
            path: objectPath,
            signedUrl: signed.signedUrl,
            token: signed.token,
            publicUrl
        });
    } catch (error) {
        console.error('Failed to create Supabase signed upload URL.', error);
        sendJson(res, error.status || 502, {
            error: 'Не вдалося підготувати завантаження у Supabase Storage.',
            details: error.details || error.message
        });
    }
};
