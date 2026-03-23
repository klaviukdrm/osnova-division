const BASE_APPAREL_PRICE = 650;
const HIGH_APPAREL_PRICE = 750;
const BASE_APPAREL_LABEL = 'Футболка з надруком';
const DOUBLE_SIDED_APPAREL_LABEL = 'Футболка з двостороннім надруком';

const HIGH_PRICE_APPAREL_DESIGNS = new Set([
    '9999',
    'CAPTAIN AMERICA',
    'DUNE 2',
    'KULYA V LOB',
    'TNMT',
    'ЖИТТЄЛЮБ',
    'ЗЕНИК',
    'ЩУР MOTHERS CHAMBER'
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

function toCatalogImagePath(fileName) {
    const normalized = String(fileName || '').trim();
    if (!normalized) return '';
    if (normalized.includes('%')) return `images/${normalized}`;
    return `images/${encodeURIComponent(normalized)}`;
}

function normalizeCatalogImagePath(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^(https?:)?\/\//i.test(raw) || raw.startsWith('data:')) return raw;

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
    const decoded = raw.includes('%') ? decodeURIComponent(raw) : raw;
    return decoded
        .replace(/\.[^.]+$/, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeCatalogCategoryName(category) {
    const value = String(category || '').trim();
    if (!value) return BASE_APPAREL_LABEL;

    const lower = value.toLowerCase();
    if (lower === 'футболки' || lower === 'футболка з надруком' || lower === 'футболки з надруком') {
        return BASE_APPAREL_LABEL;
    }

    return value;
}

function slugifyProductTitle(value) {
    const source = String(value || '')
        .toLowerCase()
        .replace(/['’`"]/g, ' ')
        .replace(/&/g, ' and ')
        .replace(/_/g, ' ')
        .trim();

    if (!source) return '';

    const translitMap = {
        а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye', ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'y',
        к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch',
        ш: 'sh', щ: 'shch', ь: '', ю: 'yu', я: 'ya', ъ: '', ы: 'y', э: 'e', ё: 'yo'
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

    return {
        title: `Футболка з принтом «${designName}»`,
        price,
        image: fullImage,
        category: BASE_APPAREL_LABEL,
        displayCategory,
        description: `Готова футболка з надруком «${designName}».`,
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
        description: String(row?.description || '').trim() || `Готова футболка з надруком «${title}».`,
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
