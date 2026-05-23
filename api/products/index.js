const PRODUCTS_SELECT = 'id,title,price,image,description,category,subcategory';
const LEGACY_PRODUCTS_SELECT = 'id,title,price,image,description';
const { requireAdminSession } = require('../_lib/admin-session');

const CATEGORY_OPTIONS = [
    'Футболки',
    'Худі',
    'Чашки',
    'Термочашки',
    'Подарункові набори',
    'Сумки-шопери'
];

const DEFAULT_CATEGORY = 'Футболки';

const DEFAULT_SUBCATEGORY_BY_CATEGORY = {
    'Футболки': 'Футболка з надруком',
    'Худі': 'Худі з надруком',
    'Чашки': 'Керамічна чашка з надруком',
    'Термочашки': 'Термочашка з надруком',
    'Подарункові набори': 'Подарунковий набір',
    'Сумки-шопери': 'Сумка-шопер з надруком'
};

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

function getRequestQueryParam(req, key) {
    if (!req || !key) return '';
    const fromQuery = req.query && typeof req.query[key] !== 'undefined' ? req.query[key] : '';
    if (fromQuery) return String(fromQuery).trim();

    const rawUrl = String(req.url || '').trim();
    if (!rawUrl) return '';
    try {
        const parsed = new URL(rawUrl, 'http://localhost');
        return String(parsed.searchParams.get(key) || '').trim();
    } catch (_) {
        return '';
    }
}

function getSupabaseConfig() {
    const url = String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
    const anonKey = String(process.env.SUPABASE_ANON_KEY || '').trim();
    return { url, anonKey };
}

function safeDecodeUriComponent(value) {
    try {
        return decodeURIComponent(value);
    } catch (_) {
        return value;
    }
}

function normalizeSupabaseSignedImageUrl(parsedUrl) {
    if (!parsedUrl || !parsedUrl.pathname) return '';
    const signedPrefix = '/storage/v1/object/sign/';
    const pathname = String(parsedUrl.pathname || '');
    if (!pathname.startsWith(signedPrefix)) return '';

    const signedPath = pathname.slice(signedPrefix.length);
    const pathSegments = signedPath
        .split('/')
        .filter(Boolean)
        .map((segment) => safeDecodeUriComponent(segment));

    if (pathSegments.length < 2) return '';

    const [bucket, ...objectParts] = pathSegments;
    const encodedBucket = encodeURIComponent(bucket);
    const encodedObjectPath = objectParts
        .map((segment) => encodeURIComponent(segment))
        .join('/');

    const normalized = new URL(parsedUrl.toString());
    normalized.pathname = `/storage/v1/object/public/${encodedBucket}/${encodedObjectPath}`;
    normalized.search = '';
    normalized.hash = '';
    return normalized.toString();
}

function normalizeAbsoluteImageUrl(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (raw.startsWith('data:')) return raw;

    const withProtocol = raw.startsWith('//') ? `https:${raw}` : raw;
    try {
        const parsed = new URL(withProtocol);
        const publicUrl = normalizeSupabaseSignedImageUrl(parsed);
        if (publicUrl) return publicUrl;

        const normalizedPathname = parsed.pathname
            .split('/')
            .map((segment) => {
                if (!segment) return segment;
                try {
                    return encodeURIComponent(safeDecodeUriComponent(segment));
                } catch (_) {
                    return encodeURIComponent(segment);
                }
            })
            .join('/');
        parsed.pathname = normalizedPathname;
        return parsed.toString();
    } catch (_) {
        return raw;
    }
}

function normalizeImagePath(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^(https?:)?\/\//i.test(raw)) {
        return normalizeAbsoluteImageUrl(raw);
    }
    if (raw.startsWith('data:')) return raw;

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
            return encodeURIComponent(safeDecodeUriComponent(segment));
        })
        .join('/');

    return query ? `${encodedPath}?${query}` : encodedPath;
}

function normalizeCategory(value) {
    const raw = String(value || '').trim();
    if (!raw) return DEFAULT_CATEGORY;
    return CATEGORY_OPTIONS.includes(raw) ? raw : DEFAULT_CATEGORY;
}

function getDefaultSubcategory(category) {
    return DEFAULT_SUBCATEGORY_BY_CATEGORY[category] || DEFAULT_SUBCATEGORY_BY_CATEGORY[DEFAULT_CATEGORY];
}

function normalizeSubcategory(value, category) {
    const raw = String(value || '').trim();
    if (!raw) return getDefaultSubcategory(category);
    return raw.slice(0, 120);
}

function normalizeId(value) {
    if (value === null || typeof value === 'undefined') return '';
    return String(value).trim();
}

function normalizeProductPayload(body) {
    const title = String(body?.title || '').trim();
    const description = String(body?.description || '').trim();
    const image = normalizeImagePath(body?.image || '');
    const category = normalizeCategory(body?.category);
    const subcategory = normalizeSubcategory(body?.subcategory || body?.displayCategory, category);
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
            description,
            category,
            subcategory
        }
    };
}

function mapProductRow(row) {
    const priceNumber = Number(row?.price);
    const category = normalizeCategory(row?.category);
    const subcategory = normalizeSubcategory(row?.subcategory || row?.display_category, category);
    const rawId = row?.id ?? row?.product_id ?? '';
    const id = normalizeId(rawId);

    console.log('[API /api/products] mapProductRow id mapping', {
        rowId: row?.id,
        rowProductId: row?.product_id,
        mappedId: id,
        title: row?.title
    });

    return {
        id,
        title: String(row?.title || '').trim(),
        price: Number.isFinite(priceNumber) ? Math.max(0, Math.round(priceNumber)) : 0,
        image: normalizeImagePath(row?.image || ''),
        description: String(row?.description || '').trim(),
        category,
        subcategory
    };
}

function isMissingColumnError(error) {
    const message = String(error?.message || '').toLowerCase();
    const details = JSON.stringify(error?.details || '').toLowerCase();
    return (
        (message.includes('could not find') || message.includes('column') || details.includes('column'))
        && (
            message.includes('category')
            || message.includes('subcategory')
            || details.includes('category')
            || details.includes('subcategory')
        )
    );
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
            let rows;
            try {
                rows = await requestSupabase(
                    config,
                    `/rest/v1/products?select=${PRODUCTS_SELECT}&order=id.desc`
                );
            } catch (error) {
                if (!isMissingColumnError(error)) throw error;
                rows = await requestSupabase(
                    config,
                    `/rest/v1/products?select=${LEGACY_PRODUCTS_SELECT}&order=id.desc`
                );
            }

            const products = Array.isArray(rows) ? rows.map(mapProductRow).filter((row) => row.title) : [];
            console.log('[API /api/products GET] ids for admin list', products.map((item) => ({ id: item?.id, title: item?.title })));
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
        if (!requireAdminSession(req, res)) return;

        const normalized = normalizeProductPayload(body);
        if (normalized.error) {
            sendJson(res, 400, { error: normalized.error });
            return;
        }

        try {
            let rows;
            let warning = '';
            try {
                rows = await requestSupabase(config, '/rest/v1/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Prefer: 'return=representation'
                    },
                    body: JSON.stringify([normalized.data])
                });
            } catch (error) {
                if (!isMissingColumnError(error)) throw error;
                warning = 'Додайте колонки category/subcategory у таблицю products, щоб зберігати категорії.';
                const legacyData = {
                    title: normalized.data.title,
                    price: normalized.data.price,
                    image: normalized.data.image,
                    description: normalized.data.description
                };
                rows = await requestSupabase(config, '/rest/v1/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Prefer: 'return=representation'
                    },
                    body: JSON.stringify([legacyData])
                });
            }

            const created = Array.isArray(rows) ? rows[0] : rows;
            sendJson(res, 201, {
                ok: true,
                product: mapProductRow(created),
                warning
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

    if (req.method === 'DELETE') {
        const body = readBody(req);
        if (!requireAdminSession(req, res)) return;

        const queryId = normalizeId(getRequestQueryParam(req, 'id'));
        const bodyId = normalizeId(body?.id);
        const id = queryId || bodyId;
        console.log('[API /api/products DELETE] incoming id values', {
            queryId,
            bodyId,
            normalizedId: id,
            url: req?.url,
            query: req?.query
        });
        if (!id) {
            sendJson(res, 400, { error: 'Передайте коректний id товару для видалення.' });
            return;
        }

        try {
            const encodedId = encodeURIComponent(id);
            const rows = await requestSupabase(
                config,
                `/rest/v1/products?id=eq.${encodedId}&select=${LEGACY_PRODUCTS_SELECT}`,
                {
                    method: 'DELETE',
                    headers: {
                        Prefer: 'return=representation'
                    }
                }
            );

            const deleted = Array.isArray(rows) ? rows[0] : rows;
            if (!deleted) {
                sendJson(res, 404, {
                    error: 'Товар з таким id не знайдено або вже видалено.',
                    id
                });
                return;
            }

            sendJson(res, 200, {
                ok: true,
                deleted: mapProductRow(deleted)
            });
        } catch (error) {
            console.error('Failed to delete product in Supabase.', error);
            sendJson(res, error.status || 502, {
                error: 'Не вдалося видалити товар у Supabase.',
                details: error.details || error.message
            });
        }
        return;
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    sendJson(res, 405, { error: 'Method not allowed' });
};
