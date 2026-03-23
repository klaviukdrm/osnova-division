const PRODUCTS_SELECT = 'id,title,price,image,description';

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
    return { url, anonKey };
}

function normalizeImagePath(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^(https?:)?\/\//i.test(raw) || raw.startsWith('data:')) return raw;

    const normalizedSlashes = raw.replace(/\\/g, '/');
    const [pathOnly, query = ''] = normalizedSlashes.split('?');
    const trimmedPath = pathOnly.replace(/^\.?\//, '');
    const withRoot = trimmedPath.toLowerCase().startsWith('images/')
        ? trimmedPath
        : `images/${trimmedPath}`;

    const encodedPath = withRoot
        .split('/')
        .map((segment, index) => {
            if (!segment) return segment;
            if (index === 0 && segment.toLowerCase() === 'images') return 'images';
            try {
                return encodeURIComponent(decodeURIComponent(segment));
            } catch (_) {
                return encodeURIComponent(segment);
            }
        })
        .join('/');

    return query ? `${encodedPath}?${query}` : encodedPath;
}

function normalizeProductPayload(body) {
    const title = String(body?.title || '').trim();
    const description = String(body?.description || '').trim();
    const image = normalizeImagePath(body?.image || '');
    const priceNumber = Number(body?.price);
    const price = Number.isFinite(priceNumber) ? Math.max(0, Math.round(priceNumber)) : NaN;

    if (!title) return { error: 'Поле title обовʼязкове.' };
    if (!Number.isFinite(price) || price <= 0) return { error: 'Поле price має бути більше 0.' };
    if (!image) return { error: 'Поле image обовʼязкове.' };

    return {
        data: {
            title,
            price,
            image,
            description
        }
    };
}

function mapProductRow(row) {
    const priceNumber = Number(row?.price);
    return {
        id: row?.id,
        title: String(row?.title || '').trim(),
        price: Number.isFinite(priceNumber) ? Math.max(0, Math.round(priceNumber)) : 0,
        image: String(row?.image || '').trim(),
        description: String(row?.description || '').trim()
    };
}

async function requestSupabase(config, endpoint, options = {}) {
    const method = options.method || 'GET';
    const headers = {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        Accept: 'application/json',
        ...(options.headers || {})
    };

    const response = await fetch(`${config.url}${endpoint}`, {
        method,
        headers,
        body: options.body
    });

    const text = await response.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch (_) {
        data = text;
    }

    if (!response.ok) {
        const message = typeof data === 'string' ? data : (data?.message || data?.hint || data?.error || `Supabase error ${response.status}`);
        const error = new Error(message);
        error.status = response.status;
        error.details = data;
        throw error;
    }

    return data;
}

module.exports = async (req, res) => {
    const config = getSupabaseConfig();
    if (!config.url || !config.anonKey) {
        sendJson(res, 500, {
            error: 'SUPABASE_URL або SUPABASE_ANON_KEY не налаштовані.'
        });
        return;
    }

    if (req.method === 'GET') {
        try {
            const rows = await requestSupabase(
                config,
                `/rest/v1/products?select=${PRODUCTS_SELECT}&order=id.desc`
            );

            const products = Array.isArray(rows) ? rows.map(mapProductRow).filter((row) => row.title) : [];
            sendJson(res, 200, { ok: true, products });
        } catch (error) {
            console.error('Failed to load products from Supabase.', error);
            sendJson(res, error.status || 502, {
                error: 'Не вдалося отримати товари з Supabase.',
                details: error.details || error.message
            });
        }
        return;
    }

    if (req.method === 'POST') {
        const body = readBody(req);
        const adminPassword = String(process.env.ADMIN_PANEL_PASSWORD || '').trim();
        const suppliedPassword = String(req.headers['x-admin-password'] || body?.adminPassword || '').trim();

        if (body?.mode === 'auth') {
            if (!adminPassword) {
                sendJson(res, 500, { error: 'ADMIN_PANEL_PASSWORD не налаштований.' });
                return;
            }
            if (!suppliedPassword || suppliedPassword !== adminPassword) {
                sendJson(res, 401, { error: 'Невірний пароль адмінки.' });
                return;
            }
            sendJson(res, 200, { ok: true });
            return;
        }

        if (!adminPassword) {
            sendJson(res, 500, { error: 'ADMIN_PANEL_PASSWORD не налаштований.' });
            return;
        }
        if (!suppliedPassword || suppliedPassword !== adminPassword) {
            sendJson(res, 401, { error: 'Доступ заборонено: невірний пароль.' });
            return;
        }

        const normalized = normalizeProductPayload(body);
        if (normalized.error) {
            sendJson(res, 400, { error: normalized.error });
            return;
        }

        try {
            const rows = await requestSupabase(config, '/rest/v1/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Prefer: 'return=representation'
                },
                body: JSON.stringify([normalized.data])
            });

            const created = Array.isArray(rows) ? rows[0] : rows;
            sendJson(res, 201, {
                ok: true,
                product: mapProductRow(created)
            });
        } catch (error) {
            console.error('Failed to create product in Supabase.', error);
            sendJson(res, error.status || 502, {
                error: 'Не вдалося додати товар у Supabase.',
                details: error.details || error.message
            });
        }
        return;
    }

    res.setHeader('Allow', 'GET, POST');
    sendJson(res, 405, { error: 'Method not allowed' });
};

