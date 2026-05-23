const BASE_APPAREL_PRICE = 650;
const HIGH_APPAREL_PRICE = 750;
const BASE_APPAREL_LABEL = '\u0424\u0443\u0442\u0431\u043e\u043b\u043a\u0430 \u0437 \u043d\u0430\u0434\u0440\u0443\u043a\u043e\u043c';
const DOUBLE_SIDED_APPAREL_LABEL = '\u0424\u0443\u0442\u0431\u043e\u043b\u043a\u0430 \u0437 \u0434\u0432\u043e\u0441\u0442\u043e\u0440\u043e\u043d\u043d\u0456\u043c \u043d\u0430\u0434\u0440\u0443\u043a\u043e\u043c';

const HIGH_PRICE_APPAREL_DESIGNS = new Set([
    '9999',
    'CAPTAIN AMERICA',
    'DUNE 2',
    'KULYA V LOB',
    'TNMT',
    '\u0416\u0418\u0422\u0422\u0404\u041b\u042e\u0411',
    '\u0417\u0415\u041d\u0418\u041a',
    '\u0429\u0423\u0420 MOTHERS CHAMBER'
]);

const APPAREL_IMAGE_FILES = [
    '9999.jpg',
    'ALCOHOLICA%20%D0%9E%D0%9F%D0%86%D0%9B%D0%9B%D0%AF.jpg',
    'ALCOHOLICA%20%D0%A5%D0%9C%D0%95%D0%9B%D0%AC.jpg',
    'BOOGERMAN.jpg',
    'CAPTAIN%20AMERICA.jpg',
    'CATLOVER.jpg',
    'CONTRA.jpg',
    'DEATH%20IN%20JUNE.jpg',
    'DOOM%20%D0%91%D0%A3.jpg',
    'DOOMY.jpg',
    'DUNE%202.jpg',
    'FALLOUT2.jpg',
    'GHOSTS%20N%20GOBLINS.jpg',
    'GOMER%20PYLE.jpg',
    'HASTA%20LA%20VISTA.jpg',
    'HEROES%20III.jpg',
    'KULYA%20V%20LOB.jpg',
    'LIFELOVER%20BULBER.jpg',
    'OOM%20AUTISM.jpg',
    'OVI%20BOBUL.jpg',
    'PAPER%20IS%20MINE.jpg',
    'PRODIGY.jpg',
    'READY%20FOR%20FALLOUT.jpg',
    'ROCKNROLL%20RACING.jpg',
    'ST%20CARTMAN.jpg',
    'STALKER%202.jpg',
    'TES%20%D0%A9%D0%A3%D0%A0.jpg',
    'TNMT.jpg',
    'TRANSFORMERS.jpg',
    'TRANSFORMERS2.jpg',
    'VALVE.jpg',
    '%D0%96%D0%98%D0%A2%D0%A2%D0%84%D0%9B%D0%AE%D0%91%20%D0%91%D0%90%D0%9D%D0%9A%D0%A0%D0%9E%D0%A2%D0%A1%D0%A2%D0%92%D0%9E.jpg',
    '%D0%96%D0%98%D0%A2%D0%A2%D0%84%D0%9B%D0%AE%D0%91%20%D0%95%D0%A0%D0%9E%D0%A2%D0%98%D0%A7%D0%9D%D0%98%D0%99.jpg',
    '%D0%96%D0%98%D0%A2%D0%A2%D0%84%D0%9B%D0%AE%D0%91%20%D0%9F%D0%A3%D0%94%D0%A0%D0%90.jpg',
    '%D0%96%D0%98%D0%A2%D0%A2%D0%84%D0%9B%D0%AE%D0%91.jpg',
    '%D0%97%D0%95%D0%9D%D0%98%D0%9A.jpg',
    '%D0%97%D0%9B%D0%98%D0%99%20%D0%A0%D0%95%D0%9F%D0%95%D0%A0%20%D0%97%D0%95%D0%9D%D0%98%D0%9A.jpg',
    '%D0%9A%D0%A3%D0%A7%D0%9C%D0%A3%20%D0%92%D0%98%D0%A0%D0%9D%D0%86%D0%A2.jpg',
    '%D0%9C%D0%98%D0%9A%D0%9E%D0%9B%D0%90%D0%99%D0%A7%D0%A3%D0%9A.jpg',
    '%D0%9D%D0%86%D0%A5%D0%A3%D0%AF%20%D0%A1%D0%9E%D0%91%D0%86.jpg',
    '%D0%9F%D0%90%D0%9B%D0%86%D0%99%201.jpg',
    '%D0%9F%D0%90%D0%9B%D0%86%D0%99%202.jpg',
    '%D0%A9%D0%90%D0%A1%D0%A2%D0%AF%20%D0%97%D0%94%D0%9E%D0%A0%D0%9E%D0%92%D0%9B%D0%AF.jpg',
    '%D0%A9%D0%A3%D0%A0%20MOTHERS%20CHAMBER.jpg'
];

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
                return encodeURIComponent(safeDecodeUriComponent(segment));
            })
            .join('/');

        parsed.pathname = normalizedPathname;
        return parsed.toString();
    } catch (_) {
        return raw;
    }
}

function toCatalogImagePath(fileName) {
    const normalized = String(fileName || '').trim();
    if (!normalized) return '';
    if (normalized.includes('%')) return `images/${normalized}`;
    return `images/${encodeURIComponent(normalized)}`;
}

function normalizeCatalogImagePath(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^(https?:)?\/\//i.test(raw)) return normalizeAbsoluteImageUrl(raw);
    if (raw.startsWith('data:')) return raw;

    const normalizedSlashes = raw.replace(/\\/g, '/');
    const [pathOnly, query = ''] = normalizedSlashes.split('?');
    const trimmedPath = pathOnly.replace(/^\.?\//, '');
    const withRoot = trimmedPath.toLowerCase().startsWith('images/') ? trimmedPath : `images/${trimmedPath}`;

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

function getDesignNameFromFile(fileName) {
    const raw = String(fileName || '').trim();
    const rawUpper = raw.toUpperCase();
    if (rawUpper === 'DOOM%20%D0%91%D0%A3.JPG') {
        return 'DOOM \u0421\u0411\u0423';
    }
    if (rawUpper === 'OOM%20AUTISM.JPG') {
        return 'DOOM AUTISM';
    }
    if (rawUpper === 'OVI%20BOBUL.JPG') {
        return 'IVO BOBUL';
    }

    const decoded = raw.includes('%') ? decodeURIComponent(raw) : raw;
    const normalizedName = decoded
        .replace(/\.[^.]+$/, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (normalizedName.toUpperCase() === 'DOOM \u0411\u0423') {
        return 'DOOM \u0421\u0411\u0423';
    }
    if (normalizedName.toUpperCase() === 'OOM AUTISM') {
        return 'DOOM AUTISM';
    }
    if (normalizedName.toUpperCase() === 'OVI BOBUL') {
        return 'IVO BOBUL';
    }

    return normalizedName;
}

function extractDesignNameFromTitle(title) {
    const normalizedTitle = String(title || '').trim();
    if (!normalizedTitle) return '';

    const quotedMatch = normalizedTitle.match(/\u00ab([^\u00bb]+)\u00bb/);
    if (quotedMatch && quotedMatch[1]) {
        return quotedMatch[1].trim();
    }

    return normalizedTitle
        .replace(/^\u0424\u0443\u0442\u0431\u043e\u043b\u043a\u0430 \u0437 \u043f\u0440\u0438\u043d\u0442\u043e\u043c\s*/i, '')
        .trim();
}

function getTitleSeed(value) {
    return Array.from(String(value || '')).reduce((acc, char, index) => {
        return acc + (char.codePointAt(0) || 0) * (index + 1);
    }, 0);
}

function buildStaticProductDescription(title) {
    const designName = extractDesignNameFromTitle(title) || '\u0432\u043b\u0430\u0441\u043d\u0438\u043c \u0434\u0438\u0437\u0430\u0439\u043d\u043e\u043c';
    const variantIndex = getTitleSeed(designName) % 3;

    const firstParts = [
        `\u0421\u0442\u0438\u043b\u044c\u043d\u0430 \u0444\u0443\u0442\u0431\u043e\u043b\u043a\u0430 \u0437 \u043f\u0440\u0438\u043d\u0442\u043e\u043c \u00ab${designName}\u00bb \u0434\u043b\u044f \u043f\u043e\u0432\u0441\u044f\u043a\u0434\u0435\u043d\u043d\u043e\u0433\u043e \u043e\u0431\u0440\u0430\u0437\u0443.`,
        `\u0424\u0443\u0442\u0431\u043e\u043b\u043a\u0430 \u00ab${designName}\u00bb \u0441\u0442\u0432\u043e\u0440\u0435\u043d\u0430 \u0434\u043b\u044f \u0442\u0438\u0445, \u0445\u0442\u043e \u043b\u044e\u0431\u0438\u0442\u044c \u0432\u0438\u0440\u0430\u0437\u043d\u0456 \u043f\u0440\u0438\u043d\u0442\u0438.`,
        `\u041c\u043e\u0434\u0435\u043b\u044c \u0437 \u043f\u0440\u0438\u043d\u0442\u043e\u043c \u00ab${designName}\u00bb \u0433\u0430\u0440\u043d\u043e \u043f\u043e\u0454\u0434\u043d\u0443\u0454\u0442\u044c\u0441\u044f \u0437 \u043f\u043e\u0432\u0441\u044f\u043a\u0434\u0435\u043d\u043d\u0438\u043c \u0433\u0430\u0440\u0434\u0435\u0440\u043e\u0431\u043e\u043c.`
    ];
    const secondParts = [
        '\u042f\u043a\u0456\u0441\u043d\u0438\u0439 \u0434\u0440\u0443\u043a \u043f\u0435\u0440\u0435\u0434\u0430\u0454 \u0434\u0435\u0442\u0430\u043b\u0456 \u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043d\u044f \u0442\u0430 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u0454 \u043d\u0430\u0441\u0438\u0447\u0435\u043d\u0456 \u043a\u043e\u043b\u044c\u043e\u0440\u0438.',
        '\u0429\u0456\u043b\u044c\u043d\u0438\u0439 \u043c\u0430\u0442\u0435\u0440\u0456\u0430\u043b \u0456 \u0447\u0456\u0442\u043a\u0438\u0439 \u0434\u0440\u0443\u043a \u0437\u0430\u0431\u0435\u0437\u043f\u0435\u0447\u0443\u044e\u0442\u044c \u043e\u0445\u0430\u0439\u043d\u0438\u0439 \u0432\u0438\u0433\u043b\u044f\u0434 \u0449\u043e\u0434\u043d\u044f.',
        '\u041a\u043e\u043c\u0444\u043e\u0440\u0442\u043d\u0438\u0439 \u043a\u0440\u0456\u0439 \u0442\u0430 \u0441\u0442\u0456\u0439\u043a\u0438\u0439 \u0434\u0440\u0443\u043a \u0440\u043e\u0431\u043b\u044f\u0442\u044c \u0457\u0457 \u0437\u0440\u0443\u0447\u043d\u043e\u044e \u0434\u043b\u044f \u0440\u0435\u0433\u0443\u043b\u044f\u0440\u043d\u043e\u0433\u043e \u043d\u043e\u0441\u0456\u043d\u043d\u044f.'
    ];
    const thirdParts = [
        '\u0414\u043e\u0431\u0440\u0438\u0439 \u0432\u0438\u0431\u0456\u0440 \u0434\u043b\u044f \u0444\u0430\u043d\u0430\u0442\u0456\u0432 \u043e\u0440\u0438\u0433\u0456\u043d\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u043c\u0435\u0440\u0447\u0443.',
        '\u041f\u0456\u0434\u0456\u0439\u0434\u0435 \u0434\u043b\u044f \u0442\u0438\u0445, \u0445\u0442\u043e \u0445\u043e\u0447\u0435 \u043f\u0456\u0434\u043a\u0440\u0435\u0441\u043b\u0438\u0442\u0438 \u0441\u0432\u0456\u0439 \u0441\u0442\u0438\u043b\u044c.',
        '\u0406\u0434\u0435\u0430\u043b\u044c\u043d\u043e \u0434\u043b\u044f \u0442\u0438\u0445, \u0445\u0442\u043e \u0448\u0443\u043a\u0430\u0454 \u043f\u043e\u043c\u0456\u0442\u043d\u0438\u0439 \u0434\u0438\u0437\u0430\u0439\u043d \u043d\u0430 \u043a\u043e\u0436\u0435\u043d \u0434\u0435\u043d\u044c.'
    ];

    return `${firstParts[variantIndex]} ${secondParts[variantIndex]} ${thirdParts[variantIndex]}`;
}

function normalizeCatalogCategoryName(category) {
    const value = String(category || '').trim();
    if (!value) return BASE_APPAREL_LABEL;

    const lower = value.toLowerCase();
    if (
        lower === '\u0444\u0443\u0442\u0431\u043e\u043b\u043a\u0438'
        || lower === '\u0444\u0443\u0442\u0431\u043e\u043b\u043a\u0430 \u0437 \u043d\u0430\u0434\u0440\u0443\u043a\u043e\u043c'
        || lower === '\u0444\u0443\u0442\u0431\u043e\u043b\u043a\u0438 \u0437 \u043d\u0430\u0434\u0440\u0443\u043a\u043e\u043c'
    ) {
        return BASE_APPAREL_LABEL;
    }

    return value;
}

function slugifyProductTitle(value) {
    const source = String(value || '')
        .toLowerCase()
        .replace(/['\u2019`"]/g, ' ')
        .replace(/&/g, ' and ')
        .replace(/_/g, ' ')
        .trim();

    if (!source) return '';

    const translitMap = {
        '\u0430': 'a', '\u0431': 'b', '\u0432': 'v', '\u0433': 'h', '\u0491': 'g', '\u0434': 'd', '\u0435': 'e', '\u0454': 'ye',
        '\u0436': 'zh', '\u0437': 'z', '\u0438': 'y', '\u0456': 'i', '\u0457': 'yi', '\u0439': 'y', '\u043a': 'k', '\u043b': 'l',
        '\u043c': 'm', '\u043d': 'n', '\u043e': 'o', '\u043f': 'p', '\u0440': 'r', '\u0441': 's', '\u0442': 't', '\u0443': 'u',
        '\u0444': 'f', '\u0445': 'kh', '\u0446': 'ts', '\u0447': 'ch', '\u0448': 'sh', '\u0449': 'shch', '\u044c': '', '\u044e': 'yu',
        '\u044f': 'ya', '\u044a': '', '\u044b': 'y', '\u044d': 'e', '\u0451': 'yo'
    };

    let output = '';
    for (const char of source.normalize('NFKD')) {
        if (/^[a-z0-9]$/.test(char)) {
            output += char;
            continue;
        }

        if (Object.prototype.hasOwnProperty.call(translitMap, char)) {
            output += translitMap[char];
            continue;
        }

        output += '-';
    }

    return output
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function assignProductSlugs(products) {
    const list = Array.isArray(products) ? products : [];
    const used = new Map();

    return list.map((item, index) => {
        const rawSlug = String(item?.slug || '').trim();
        const fromRaw = rawSlug ? slugifyProductTitle(rawSlug) : '';
        const fromTitle = slugifyProductTitle(item?.title || '');
        const baseSlug = fromRaw || fromTitle || `product-${index + 1}`;

        const counter = used.get(baseSlug) || 0;
        const nextCounter = counter + 1;
        used.set(baseSlug, nextCounter);

        const uniqueSlug = nextCounter === 1 ? baseSlug : `${baseSlug}-${nextCounter}`;
        return {
            ...item,
            slug: uniqueSlug
        };
    });
}

function mapStaticProduct(fileName) {
    const designName = getDesignNameFromFile(fileName);
    const fullImage = toCatalogImagePath(fileName);
    const designKey = designName.toLocaleUpperCase('uk-UA');
    const isHighPrice = HIGH_PRICE_APPAREL_DESIGNS.has(designKey);
    const price = isHighPrice ? HIGH_APPAREL_PRICE : BASE_APPAREL_PRICE;
    const displayCategory = isHighPrice ? DOUBLE_SIDED_APPAREL_LABEL : BASE_APPAREL_LABEL;
    const title = `Футболка з принтом «${designName}»`;

    return {
        title,
        price,
        image: fullImage,
        category: BASE_APPAREL_LABEL,
        displayCategory,
        description: buildStaticProductDescription(title),
        gallery: [fullImage],
        source: 'static'
    };
}

function getStaticProducts() {
    return APPAREL_IMAGE_FILES.map(mapStaticProduct);
}

function getSupabaseConfig() {
    const url = String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
    const anonKey = String(process.env.SUPABASE_ANON_KEY || '').trim();
    return { url, anonKey };
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

async function requestSupabase(config, endpoint) {
    const response = await fetch(`${config.url}${endpoint}`, {
        method: 'GET',
        headers: {
            apikey: config.anonKey,
            Authorization: `Bearer ${config.anonKey}`,
            Accept: 'application/json'
        }
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

function mapApiProduct(row) {
    const title = String(row?.title || '').trim();
    if (!title) return null;

    const priceValue = Number(row?.price);
    const price = Number.isFinite(priceValue) ? Math.max(0, Math.round(priceValue)) : 0;
    const image = normalizeCatalogImagePath(row?.image || '');
    const category = normalizeCatalogCategoryName(row?.category || BASE_APPAREL_LABEL);
    const subcategory = String(row?.subcategory || row?.display_category || '').trim();
    const displayCategory = subcategory || (
        price >= HIGH_APPAREL_PRICE ? DOUBLE_SIDED_APPAREL_LABEL : BASE_APPAREL_LABEL
    );

    return {
        id: row?.id,
        title,
        price,
        image,
        category,
        displayCategory,
        description: String(row?.description || '').trim() || `\u0413\u043e\u0442\u043e\u0432\u0430 \u0444\u0443\u0442\u0431\u043e\u043b\u043a\u0430 \u0437 \u043d\u0430\u0434\u0440\u0443\u043a\u043e\u043c \u00ab${title}\u00bb.`,
        gallery: image ? [image] : [],
        source: 'api'
    };
}

async function getApiProducts() {
    const config = getSupabaseConfig();
    if (!config.url || !config.anonKey) {
        return [];
    }

    try {
        let rows;
        try {
            rows = await requestSupabase(config, '/rest/v1/products?select=id,title,price,image,description,category,subcategory&order=id.desc');
        } catch (error) {
            if (!isMissingColumnError(error)) throw error;
            rows = await requestSupabase(config, '/rest/v1/products?select=id,title,price,image,description&order=id.desc');
        }

        return Array.isArray(rows) ? rows.map(mapApiProduct).filter(Boolean) : [];
    } catch (error) {
        console.warn('[product-catalog] Failed to load API products for SEO:', error?.message || error);
        return [];
    }
}

async function getAllCatalogProducts() {
    const staticProducts = getStaticProducts();
    const apiProducts = await getApiProducts();
    const all = [...staticProducts, ...apiProducts];
    return assignProductSlugs(all);
}

module.exports = {
    getAllCatalogProducts,
    slugifyProductTitle,
    assignProductSlugs
};
