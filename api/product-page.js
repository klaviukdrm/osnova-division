const { getAllCatalogProducts } = require('./_lib/product-catalog');

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function ensureAbsolutePath(url) {
    const raw = String(url || '').trim();
    if (!raw) return '';
    if (/^(https?:)?\/\//i.test(raw) || raw.startsWith('data:')) return raw;
    return `/${raw.replace(/^\/+/, '')}`;
}

function getBaseUrl(req) {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return `${protocol}://${host}`;
}

function getSlug(req) {
    const fromQuery = String(req?.query?.slug || '').trim();
    if (fromQuery) return decodeURIComponent(fromQuery).toLowerCase();

    const rawUrl = String(req?.url || '').trim();
    if (!rawUrl) return '';
    const match = rawUrl.match(/slug=([^&]+)/i);
    if (match && match[1]) {
        return decodeURIComponent(match[1]).toLowerCase();
    }
    return '';
}

function buildNotFoundHtml(baseUrl) {
    const title = 'Товар не знайдено | Ukrainian Print Family';
    const canonical = `${baseUrl}/`;

    return `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="Товар не знайдено.">
    <meta name="robots" content="noindex, nofollow">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body class="tail-container bg-white text-slate-900">
    <main class="min-h-screen flex items-center justify-center px-6">
        <div class="max-w-xl w-full rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <h1 class="text-3xl font-bold section-title">Товар не знайдено</h1>
            <p class="text-slate-600 mt-3">Можливо, цей товар видалено або посилання застаріло.</p>
            <a href="/index.html#products" class="inline-flex mt-6 liquid-glass-btn px-5 py-3 rounded-2xl bg-blue-700 text-white font-semibold">
                До каталогу
            </a>
        </div>
    </main>
</body>
</html>`;
}

function buildProductHtml(product, baseUrl) {
    const title = String(product?.title || 'Товар').trim();
    const description = String(product?.description || `Сторінка товару «${title}».`).trim();
    const category = String(product?.displayCategory || product?.category || 'Каталог').trim();
    const priceValue = Number(product?.price);
    const priceLabel = Number.isFinite(priceValue) ? `${priceValue.toLocaleString('uk-UA')} грн` : 'Ціна уточнюється';
    const image = ensureAbsolutePath((Array.isArray(product?.gallery) && product.gallery[0]) || product?.image || '');
    const canonical = `${baseUrl}/product/${encodeURIComponent(String(product?.slug || ''))}`;
    const absoluteImage = image
        ? (/^(https?:)?\/\//i.test(image) ? image : `${baseUrl}${image}`)
        : `${baseUrl}/images/logosait.jpg`;
    const pageTitle = `${title} | Ukrainian Print Family`;

    return `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <meta property="og:type" content="product">
    <meta property="og:locale" content="uk_UA">
    <meta property="og:title" content="${escapeHtml(pageTitle)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(absoluteImage)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(absoluteImage)}">
    <script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: title,
        description,
        image: [absoluteImage],
        category,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'UAH',
            price: Number.isFinite(priceValue) ? String(priceValue) : '',
            availability: 'https://schema.org/InStock',
            url: canonical
        }
    })}</script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body class="tail-container bg-white text-slate-900 overflow-x-hidden">
    <nav class="bg-white/95 border-b border-slate-200 sticky top-0 z-50 backdrop-blur">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <a href="/index.html#products" class="inline-flex items-center gap-2 liquid-glass-btn px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-800">
                <i class="fa-solid fa-arrow-left"></i>
                До каталогу
            </a>
            <a href="/index.html" class="flex items-center gap-2 text-slate-900 font-semibold">
                <img src="/images/photo_2025-09-24_14-16-02.jpg" alt="Логотип" class="w-8 h-8 rounded-xl object-cover border border-slate-200">
                <span>Ukrainian Print Family</span>
            </a>
        </div>
    </nav>

    <main class="py-10 md:py-14">
        <section class="max-w-7xl mx-auto px-6">
            <article class="grid lg:grid-cols-2 gap-10 items-start">
                <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4 md:p-6">
                    <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" class="w-full rounded-2xl object-cover bg-white">
                </div>
                <div class="space-y-5">
                    <p class="text-xs uppercase tracking-[0.25em] text-slate-400">${escapeHtml(category)}</p>
                    <h1 class="text-3xl md:text-5xl font-bold section-title">${escapeHtml(title)}</h1>
                    <p class="text-3xl font-semibold text-emerald-600">${escapeHtml(priceLabel)}</p>
                    <p class="text-lg text-slate-600 leading-relaxed">${escapeHtml(description)}</p>
                    <div class="pt-2">
                        <a href="/index.html#products" class="inline-flex liquid-glass-btn px-6 py-3 rounded-2xl bg-blue-700 text-white font-semibold">
                            Відкрити каталог
                        </a>
                    </div>
                </div>
            </article>
        </section>
    </main>
</body>
</html>`;
}

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        res.status(405).send('Method Not Allowed');
        return;
    }

    const baseUrl = getBaseUrl(req);
    const slug = getSlug(req);
    if (!slug) {
        res.status(404).setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(buildNotFoundHtml(baseUrl));
        return;
    }

    const products = await getAllCatalogProducts();
    const product = products.find((item) => String(item?.slug || '').toLowerCase() === slug);
    if (!product) {
        res.status(404).setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(buildNotFoundHtml(baseUrl));
        return;
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(buildProductHtml(product, baseUrl));
};
