const MAX_UPLOAD_SIZE_BYTES = 12 * 1024 * 1024;
const { requireAdminSession } = require('../_lib/admin-session');
const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
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
    const anonKey = String(process.env.SUPABASE_ANON_KEY || '').trim();
    const bucket = String(process.env.SUPABASE_STORAGE_BUCKET || 'products').trim() || 'products';
    return { url, anonKey, bucket };
}

function parseDataUrl(value) {
    const input = String(value || '').trim();
    const match = input.match(/^data:([^;]+);base64,(.+)$/i);
    if (!match) return null;
    return {
        mimeType: String(match[1] || '').toLowerCase(),
        base64Data: String(match[2] || '')
    };
}

function extensionFromMime(mimeType) {
    if (mimeType === 'image/png') return 'png';
    if (mimeType === 'image/webp') return 'webp';
    if (mimeType === 'image/gif') return 'gif';
    return 'jpg';
}

function sanitizeFileStem(name) {
    const base = String(name || '')
        .replace(/\.[^.]+$/, '')
        .replace(/[^\w\-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
    return base || 'product-image';
}

function toCategorySlug(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return 'other';
    if (raw.includes('футбол')) return 'futbolky';
    if (raw.includes('худі')) return 'hudi';
    if (raw.includes('термо')) return 'termochashky';
    if (raw.includes('чаш')) return 'chashky';
    if (raw.includes('подар')) return 'podarunkovi-nabory';
    if (raw.includes('сум')) return 'sumky-shopery';
    return raw
        .replace(/[^\w\-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') || 'other';
}

function buildObjectPath({ category, fileName, mimeType }) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 10);
    const extension = extensionFromMime(mimeType);
    const stem = sanitizeFileStem(fileName);
    const folder = toCategorySlug(category);
    return `${folder}/${timestamp}-${random}-${stem}.${extension}`;
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
    }

    const config = getSupabaseConfig();
    if (!config.url || !config.anonKey) {
        sendJson(res, 500, {
            error: 'SUPABASE_URL або SUPABASE_ANON_KEY не налаштовані.'
        });
        return;
    }

    const body = readBody(req);
    if (!requireAdminSession(req, res)) return;

    const parsed = parseDataUrl(body?.dataUrl);
    if (!parsed) {
        sendJson(res, 400, { error: 'Невірний формат dataUrl (очікується base64 data URL).' });
        return;
    }

    const mimeType = parsed.mimeType;
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        sendJson(res, 400, { error: 'Підтримуються тільки JPEG/PNG/WEBP/GIF.' });
        return;
    }

    let buffer;
    try {
        buffer = Buffer.from(parsed.base64Data, 'base64');
    } catch (_) {
        sendJson(res, 400, { error: 'Не вдалося декодувати файл.' });
        return;
    }

    if (!buffer.length) {
        sendJson(res, 400, { error: 'Файл порожній.' });
        return;
    }

    if (buffer.length > MAX_UPLOAD_SIZE_BYTES) {
        sendJson(res, 413, { error: 'Файл занадто великий. Максимум 12MB.' });
        return;
    }

    const objectPath = buildObjectPath({
        category: body?.category,
        fileName: body?.fileName,
        mimeType
    });
    const encodedObjectPath = objectPath.split('/').map((part) => encodeURIComponent(part)).join('/');
    const uploadUrl = `${config.url}/storage/v1/object/${encodeURIComponent(config.bucket)}/${encodedObjectPath}`;

    try {
        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                apikey: config.anonKey,
                Authorization: `Bearer ${config.anonKey}`,
                'Content-Type': mimeType,
                'x-upsert': 'true'
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
        console.error('Failed to upload image to Supabase Storage.', error);
        sendJson(res, 502, { error: 'Помилка при завантаженні у Supabase Storage.' });
    }
};
