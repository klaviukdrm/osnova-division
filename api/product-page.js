const { getAllCatalogProducts } = require('./_lib/product-catalog');

const APPAREL_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
const BASE_APPAREL_LABEL = '\u0424\u0443\u0442\u0431\u043e\u043b\u043a\u0430 \u0437 \u043d\u0430\u0434\u0440\u0443\u043a\u043e\u043c';
const HOODIE_SIZES = ['S', 'M', 'L', 'XL', '2XL'];
const OVERSIZE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const OVERSIZE_SURCHARGE = 200;
const OVERSIZE_SIZE_CHART_IMAGE = '/images/photo_2026-05-14_11-09-43.jpg';
const OVERSIZE_SIZE_CHART_ALT = '\u0420\u043e\u0437\u043c\u0456\u0440\u043d\u0430 \u0441\u0456\u0442\u043a\u0430 \u0434\u043b\u044f oversize \u0444\u0443\u0442\u0431\u043e\u043b\u043e\u043a';
const OVERSIZE_SIZE_CHART_TITLE = '\u0422\u0430\u0431\u043b\u0438\u0446\u044f \u0440\u043e\u0437\u043c\u0456\u0440\u0456\u0432 \u0434\u043b\u044f oversize \u0444\u0443\u0442\u0431\u043e\u043b\u043e\u043a';

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

    const queryMatch = rawUrl.match(/slug=([^&]+)/i);
    if (queryMatch && queryMatch[1]) {
        return decodeURIComponent(queryMatch[1]).toLowerCase();
    }

    try {
        const parsed = new URL(rawUrl, 'http://localhost');
        const pathMatch = parsed.pathname.match(/^\/product\/([^/?#]+)/i);
        if (pathMatch && pathMatch[1]) {
            return decodeURIComponent(pathMatch[1]).toLowerCase();
        }
    } catch (_) {
        const plainPathMatch = rawUrl.match(/\/product\/([^/?#]+)/i);
        if (plainPathMatch && plainPathMatch[1]) {
            return decodeURIComponent(plainPathMatch[1]).toLowerCase();
        }
    }

    return '';
}

function isApparelProduct(product) {
    const haystack = `${product?.category || ''} ${product?.displayCategory || ''} ${product?.title || ''}`
        .toLowerCase();
    return haystack.includes('\u0444\u0443\u0442\u0431\u043e\u043b') || haystack.includes('\u0445\u0443\u0434\u0456') || haystack.includes('\u0445\u0443\u0434\u0438') || haystack.includes('hoodie');
}

function isHoodieProduct(product) {
    const haystack = `${product?.category || ''} ${product?.displayCategory || ''} ${product?.subcategory || ''} ${product?.title || ''}`
        .toLowerCase();
    return haystack.includes('\u0445\u0443\u0434\u0456') || haystack.includes('\u0445\u0443\u0434\u0438') || haystack.includes('hoodie');
}

function isTshirtProduct(product) {
    const haystack = `${product?.category || ''} ${product?.displayCategory || ''} ${product?.subcategory || ''} ${product?.title || ''}`
        .toLowerCase();
    return haystack.includes('\u0444\u0443\u0442\u0431\u043e\u043b');
}

function buildNotFoundHtml(baseUrl) {
    const title = '\u0422\u043e\u0432\u0430\u0440 \u043d\u0435 \u0437\u043d\u0430\u0439\u0434\u0435\u043d\u043e | Ukrainian Print Family';
    const canonical = `${baseUrl}/`;

    return `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="\u0422\u043e\u0432\u0430\u0440 \u043d\u0435 \u0437\u043d\u0430\u0439\u0434\u0435\u043d\u043e.">
    <meta name="robots" content="noindex, nofollow">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body class="tail-container bg-white text-slate-900">
    <main class="min-h-screen flex items-center justify-center px-6">
        <div class="max-w-xl w-full rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <h1 class="text-3xl font-bold section-title">\u0422\u043e\u0432\u0430\u0440 \u043d\u0435 \u0437\u043d\u0430\u0439\u0434\u0435\u043d\u043e</h1>
            <p class="text-slate-600 mt-3">\u041c\u043e\u0436\u043b\u0438\u0432\u043e, \u0446\u0435\u0439 \u0442\u043e\u0432\u0430\u0440 \u0432\u0438\u0434\u0430\u043b\u0435\u043d\u043e \u0430\u0431\u043e \u043f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f \u0437\u0430\u0441\u0442\u0430\u0440\u0456\u043b\u043e.</p>
            <a href="/index.html#products" class="inline-flex mt-6 liquid-glass-btn px-5 py-3 rounded-2xl bg-blue-700 text-white font-semibold">
                \u0414\u043e \u043a\u0430\u0442\u0430\u043b\u043e\u0433\u0443
            </a>
        </div>
    </main>
</body>
</html>`;
}

function buildProductHtml(product, baseUrl) {
    const title = String(product?.title || '\u0422\u043e\u0432\u0430\u0440').trim();
    const description = String(product?.description || `\u0421\u0442\u043e\u0440\u0456\u043d\u043a\u0430 \u0442\u043e\u0432\u0430\u0440\u0443 \u00ab${title}\u00bb.`).trim();
    const category = String(product?.displayCategory || product?.category || '\u041a\u0430\u0442\u0430\u043b\u043e\u0433').trim();
    const priceValue = Number(product?.price);
    const priceLabel = Number.isFinite(priceValue)
        ? `${priceValue.toLocaleString('uk-UA')} \u0433\u0440\u043d`
        : '\u0426\u0456\u043d\u0430 \u0443\u0442\u043e\u0447\u043d\u044e\u0454\u0442\u044c\u0441\u044f';
    const image = ensureAbsolutePath((Array.isArray(product?.gallery) && product.gallery[0]) || product?.image || '');
    const canonical = `${baseUrl}/product/${encodeURIComponent(String(product?.slug || ''))}`;
    const absoluteImage = image
        ? (/^(https?:)?\/\//i.test(image) ? image : `${baseUrl}${image}`)
        : `${baseUrl}/images/logosait.jpg`;
    const pageTitle = `${title} | Ukrainian Print Family`;
    const supportsSizes = isApparelProduct(product);
    const hoodieProduct = isHoodieProduct(product);
    const tshirtProduct = isTshirtProduct(product);
    const regularSizes = supportsSizes ? (hoodieProduct ? HOODIE_SIZES : APPAREL_SIZES) : [];
    const availableSizes = regularSizes;
    const defaultSize = regularSizes[0] || '';
    const slug = String(product?.slug || '').trim();
    const sizeChartImage = hoodieProduct
        ? '/images/setkarozmera.jpg'
        : '/images/Screenshot_214%20(1).png';
    const sizeChartAlt = hoodieProduct
        ? '\u0420\u043e\u0437\u043c\u0456\u0440\u043d\u0430 \u0441\u0456\u0442\u043a\u0430 \u0434\u043b\u044f \u0445\u0443\u0434\u0456'
        : '\u0420\u043e\u0437\u043c\u0456\u0440\u043d\u0430 \u0441\u0456\u0442\u043a\u0430 \u0434\u043b\u044f \u0444\u0443\u0442\u0431\u043e\u043b\u043e\u043a';
    const sizeChartTitle = hoodieProduct
        ? '\u0422\u0430\u0431\u043b\u0438\u0446\u044f \u0440\u043e\u0437\u043c\u0456\u0440\u0456\u0432 \u0434\u043b\u044f \u0445\u0443\u0434\u0456'
        : '\u0422\u0430\u0431\u043b\u0438\u0446\u044f \u0440\u043e\u0437\u043c\u0456\u0440\u0456\u0432 \u0434\u043b\u044f \u0444\u0443\u0442\u0431\u043e\u043b\u043e\u043a';

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
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
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
    <style>
        .product-page-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.55rem;
            min-height: 3.2rem;
            padding: 0.78rem 1.6rem;
            border-radius: 0.95rem;
            border: 2px solid transparent;
            font-size: 1.05rem;
            font-weight: 800;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            white-space: nowrap;
            transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease, background 0.2s ease;
            user-select: none;
        }

        .product-page-btn:hover {
            transform: translateY(-1px);
        }

        .product-page-btn:active {
            transform: translateY(0);
        }

        .product-page-btn--green {
            background: linear-gradient(180deg, #178a44 0%, #146636 100%);
            border-color: #22c55e;
            color: #ffffff;
            box-shadow: 0 10px 20px rgba(8, 89, 44, 0.36);
        }

        .product-page-btn--green:hover {
            filter: brightness(1.05);
            box-shadow: 0 14px 24px rgba(8, 89, 44, 0.42);
        }

        .product-page-btn--orange {
            background: linear-gradient(180deg, #f07a1c 0%, #d45f0a 100%);
            border-color: #fb923c;
            color: #ffffff;
            box-shadow: 0 10px 20px rgba(172, 86, 16, 0.34);
        }

        .product-page-btn--orange:hover {
            filter: brightness(1.05);
            box-shadow: 0 14px 24px rgba(172, 86, 16, 0.42);
        }

        @media (min-width: 1024px) {
            .product-page-layout {
                grid-template-columns: minmax(0, 1.22fr) minmax(0, 0.78fr) !important;
                gap: 3rem !important;
            }

            .product-page-image-wrap,
            .product-page-image {
                min-height: 42rem;
            }

            .product-page-image {
                height: 100%;
            }
        }

        .product-page-image-wrap {
            position: relative;
            background: radial-gradient(circle at 20% 20%, #f8fafc 0%, #eef2ff 38%, #e2e8f0 100%);
        }

        .product-page-image {
            cursor: zoom-in;
            transition: transform 0.26s ease, filter 0.26s ease;
        }

        .product-page-image-wrap:hover .product-page-image {
            transform: scale(1.015);
            filter: saturate(1.03);
        }

        .product-image-zoom-hint {
            position: absolute;
            right: 1rem;
            bottom: 1rem;
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            padding: 0.45rem 0.75rem;
            border-radius: 999px;
            background: rgba(15, 23, 42, 0.72);
            color: #ffffff;
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.01em;
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.28);
            pointer-events: none;
        }

        #product-image-lightbox {
            opacity: 0;
            transition: opacity 0.22s ease;
        }

        #product-image-lightbox.is-open {
            opacity: 1;
        }

        .product-lightbox-stage {
            transform: translateY(10px) scale(0.985);
            transition: transform 0.24s ease;
        }

        #product-image-lightbox.is-open .product-lightbox-stage {
            transform: translateY(0) scale(1);
        }

        .product-lightbox-image {
            display: block;
            max-width: min(95vw, 1480px);
            max-height: 89vh;
            width: auto;
            height: auto;
            object-fit: contain;
            border-radius: 1rem;
            background: rgba(255, 255, 255, 0.04);
            box-shadow: 0 28px 90px rgba(2, 6, 23, 0.58);
            user-select: none;
            -webkit-user-drag: none;
        }

        #product-image-lightbox-close {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }

        @media (max-width: 768px) {
            .product-image-zoom-hint {
                right: 0.75rem;
                bottom: 0.75rem;
                font-size: 0.74rem;
                padding: 0.38rem 0.62rem;
            }

            .product-lightbox-image {
                max-width: 95vw;
                max-height: 82vh;
                border-radius: 0.85rem;
            }
        }
    </style>
</head>
<body class="tail-container bg-white text-slate-900 overflow-x-hidden">
    <nav class="bg-white/95 border-b border-slate-200 sticky top-0 z-50 backdrop-blur">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <a href="/index.html#products" class="inline-flex items-center gap-2 liquid-glass-btn px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-800">
                <i class="fa-solid fa-arrow-left"></i>
                \u0414\u043e \u043a\u0430\u0442\u0430\u043b\u043e\u0433\u0443
            </a>
            <a href="/index.html" class="flex items-center gap-2 text-slate-900 font-semibold">
                <img src="/images/photo_2025-09-24_14-16-02.jpg" alt="\u041b\u043e\u0433\u043e\u0442\u0438\u043f" class="w-8 h-8 rounded-xl object-cover border border-slate-200">
                <span>Ukrainian Print Family</span>
            </a>
        </div>
    </nav>

    <main class="py-10 md:py-14">
        <section class="max-w-7xl mx-auto px-6">
            <article class="product-page-layout grid lg:grid-cols-2 gap-10 items-start">
                <div class="product-page-image-wrap rounded-3xl overflow-hidden">
                    <img
                        id="product-main-image"
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(title)}"
                        class="product-page-image w-full rounded-3xl object-cover"
                        role="button"
                        tabindex="0"
                        aria-label="\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438 \u0444\u043e\u0442\u043e \u043d\u0430 \u0432\u0435\u0441\u044c \u0435\u043a\u0440\u0430\u043d"
                    >
                    <div class="product-image-zoom-hint">
                        <i class="fa-solid fa-expand"></i>
                        \u041d\u0430 \u0432\u0435\u0441\u044c \u0435\u043a\u0440\u0430\u043d
                    </div>
                </div>
                <div class="space-y-5">
                    <h1 class="text-3xl md:text-5xl font-bold section-title">${escapeHtml(title)}</h1>
                    <p id="product-price-label" class="text-3xl font-semibold text-emerald-600">${escapeHtml(priceLabel)}</p>
                    ${availableSizes.length ? `
                    <div class="pt-1">
                        <p class="product-card-v2__meta-label mb-2">\u0420\u043e\u0437\u043c\u0456\u0440</p>
                        ${tshirtProduct ? `
                        <div id="product-fit-options" class="product-card-v2__fit-toggle mb-2">
                            <button
                                type="button"
                                class="product-card-v2__fit-btn is-active"
                                data-product-fit="regular"
                                aria-pressed="true"
                            >regular</button>
                            <button
                                type="button"
                                class="product-card-v2__fit-btn"
                                data-product-fit="oversize"
                                aria-pressed="false"
                            >oversize</button>
                        </div>
                        ` : ''}
                        <div id="product-size-options" class="product-card-v2__sizes">
                            ${availableSizes.map((size, index) => `
                                <button
                                    type="button"
                                    class="product-card-v2__size ${index === 0 ? 'is-active' : ''}"
                                    data-product-size="${escapeHtml(size)}"
                                    aria-pressed="${index === 0 ? 'true' : 'false'}"
                                >${escapeHtml(size)}</button>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <div class="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                        <button id="product-order-btn" type="button" class="product-page-btn product-page-btn--green w-full">
                            <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
                            \u0412 \u043a\u043e\u0448\u0438\u043a
                        </button>
                        ${availableSizes.length ? `
                        <button id="product-size-chart-btn" type="button" class="product-page-btn product-page-btn--orange w-full">
                            \u0420\u043e\u0437\u043c\u0456\u0440\u0438
                        </button>
                        ` : ''}
                    </div>

                    <p class="text-lg text-slate-600 leading-relaxed" style="white-space: pre-line;">${escapeHtml(description)}</p>
                </div>
            </article>
        </section>
    </main>

    <footer id="contacts" class="product-page-desktop-footer hidden lg:block bg-slate-900 text-white py-16">
        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
            <div>
                <div class="flex items-center gap-x-3 mb-6">
                    <div class="w-8 h-8 bg-white rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center">
                        <img src="/images/photo_2025-09-24_14-16-02.jpg" alt="\u041b\u043e\u0433\u043e\u0442\u0438\u043f Ukrainian Print Family" class="w-full h-full object-cover">
                    </div>
                    <span class="text-2xl font-bold">Ukrainian Print Family</span>
                </div>
                <p class="text-slate-400 leading-relaxed">\u0421\u0442\u043e\u0440\u0456\u043d\u043a\u0430 \u043a\u043e\u043d\u0441\u0442\u0440\u0443\u043a\u0442\u043e\u0440\u0430 \u0434\u043b\u044f \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u0456\u0437\u0430\u0446\u0456\u0457 \u0434\u0440\u0443\u043a\u0443 \u043d\u0430 \u043e\u0434\u044f\u0437\u0456 \u0442\u0430 \u043f\u043e\u0441\u0443\u0434\u0456.</p>
            </div>

            <div>
                <p class="font-medium mb-4">\u0428\u0432\u0438\u0434\u043a\u0456 \u043f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f</p>
                <div class="space-y-2 text-slate-400 text-sm">
                    <a href="/index.html#products" class="block hover:text-white transition">\u041a\u0430\u0442\u0430\u043b\u043e\u0433</a>
                    <a href="/editor.html" class="block hover:text-white transition">\u041a\u043e\u043d\u0441\u0442\u0440\u0443\u043a\u0442\u043e\u0440</a>
                    <a href="#contacts" class="block hover:text-white transition">\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u0438</a>
                </div>
            </div>

            <div>
                <p class="font-medium mb-4">\u0417\u0432'\u044f\u0437\u0430\u0442\u0438\u0441\u044f \u0437 \u043d\u0430\u043c\u0438</p>
                <p class="text-slate-400">\u0425\u043c\u0435\u043b\u044c\u043d\u0438\u0446\u044c\u043a\u0438\u0439, \u0423\u043a\u0440\u0430\u0457\u043d\u0430</p>
                <p class="text-slate-400">+380986677359</p>
                <p class="text-slate-400">dreamprint777@ukr.net</p>
                <a href="https://t.me/Ukrainian_Print_Familybot" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-2xl border border-slate-600 hover:border-sky-400 text-slate-200 hover:text-white transition">
                    <i class="fa-brands fa-telegram"></i>
                    @Ukrainian_Print_Familybot
                </a>
                <div class="mt-3 flex flex-wrap gap-2">
                    <a href="https://www.instagram.com/ukrainian_print_family?igsh=YXVlNGV1a204ZGVi" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-600 hover:border-pink-400 text-slate-200 hover:text-white transition">
                        <i class="fa-brands fa-instagram"></i>
                        Instagram
                    </a>
                    <a href="https://www.tiktok.com/@ukrainian_print_family?_r=1&_t=ZS-94w8loPo8hB" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-600 hover:border-cyan-400 text-slate-200 hover:text-white transition">
                        <i class="fa-brands fa-tiktok"></i>
                        TikTok
                    </a>
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-6 mt-10">
            <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
                <a href="/index.html#contacts" class="hover:text-white transition">\u0414\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0456 \u043e\u043f\u043b\u0430\u0442\u0430</a>
                <span class="text-slate-600">\u2022</span>
                <a href="/index.html#contacts" class="hover:text-white transition">\u0423\u0433\u043e\u0434\u0430 \u043a\u043e\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430</a>
                <span class="text-slate-600">\u2022</span>
                <a href="/index.html#contacts" class="hover:text-white transition">\u041f\u043e\u043b\u0456\u0442\u0438\u043a\u0430 \u043a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u043e\u0441\u0442\u0456</a>
            </div>
        </div>

        <div class="text-center text-xs text-slate-500 mt-20">
            \u00A9 2026 Ukrainian Print Family. \u0423\u0441\u0456 \u043f\u0440\u0430\u0432\u0430 \u0437\u0430\u0445\u0438\u0449\u0435\u043d\u0456.
        </div>
    </footer>

    <div id="product-image-lightbox" class="fixed inset-0 z-[72] hidden" aria-hidden="true">
        <button
            type="button"
            id="product-image-lightbox-backdrop"
            class="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
            aria-label="\u0417\u0430\u043a\u0440\u0438\u0442\u0438 \u043f\u0435\u0440\u0435\u0433\u043b\u044f\u0434 \u0444\u043e\u0442\u043e"
        ></button>
        <div id="product-image-lightbox-shell" class="relative h-full w-full flex items-center justify-center px-3 py-6 md:px-8 md:py-8">
            <button
                type="button"
                id="product-image-lightbox-close"
                class="absolute top-4 right-4 md:top-6 md:right-6 z-[2] w-11 h-11 rounded-full border border-white/30 bg-slate-900/55 text-white flex items-center justify-center hover:bg-slate-800/75 hover:border-white/60 transition"
                aria-label="\u0417\u0430\u043a\u0440\u0438\u0442\u0438"
            >
                <i class="fa-solid fa-xmark text-lg"></i>
            </button>
            <div class="product-lightbox-stage relative max-w-full max-h-full">
                <img
                    id="product-image-lightbox-image"
                    src="${escapeHtml(image)}"
                    alt="${escapeHtml(title)}"
                    class="product-lightbox-image"
                >
            </div>
        </div>
    </div>

    ${availableSizes.length ? `
    <div id="product-size-chart-modal" class="fixed inset-0 z-[64] hidden">
        <button type="button" class="absolute inset-0 bg-slate-900/75" data-size-chart-close aria-label="\u0417\u0430\u043a\u0440\u0438\u0442\u0438"></button>
        <div class="relative max-w-4xl mx-auto mt-8 mb-8 bg-white rounded-3xl shadow-2xl p-5 md:p-7 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <button type="button" class="absolute top-4 right-4 w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:border-blue-700 transition" data-size-chart-close aria-label="\u0417\u0430\u043a\u0440\u0438\u0442\u0438">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="pr-12">
                <p class="text-xs uppercase tracking-[0.25em] text-slate-400">\u0420\u041e\u0417\u041c\u0406\u0420\u041d\u0410 \u0421\u0406\u0422\u041a\u0410</p>
                <h3 id="product-size-chart-title" class="text-2xl md:text-3xl font-bold section-title mt-2">${escapeHtml(sizeChartTitle)}</h3>
            </div>
            <div class="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-2 md:p-3">
                <img id="product-size-chart-image" src="${escapeHtml(sizeChartImage)}" alt="${escapeHtml(sizeChartAlt)}" class="w-full h-auto rounded-xl object-contain bg-white">
            </div>
        </div>
    </div>
    ` : ''}

    <script>
    (() => {
        const orderBtn = document.getElementById('product-order-btn');
        const productMainImage = document.getElementById('product-main-image');
        const imageLightbox = document.getElementById('product-image-lightbox');
        const imageLightboxShell = document.getElementById('product-image-lightbox-shell');
        const imageLightboxBackdrop = document.getElementById('product-image-lightbox-backdrop');
        const imageLightboxClose = document.getElementById('product-image-lightbox-close');
        const imageLightboxImage = document.getElementById('product-image-lightbox-image');
        const priceLabelEl = document.getElementById('product-price-label');
        const sizeOptionsEl = document.getElementById('product-size-options');
        const fitButtons = Array.from(document.querySelectorAll('[data-product-fit]'));
        const tshirtProduct = ${JSON.stringify(tshirtProduct)};
        const regularSizes = ${JSON.stringify(regularSizes)};
        const oversizeSizes = ${JSON.stringify(tshirtProduct ? OVERSIZE_SIZES : [])};
        let fitMode = 'regular';
        const selectedSizeByFit = {
            regular: ${JSON.stringify(defaultSize)},
            oversize: oversizeSizes[0] || ''
        };
        let selectedSize = selectedSizeByFit.regular || '';
        const slug = ${JSON.stringify(slug)};
        const basePrice = ${JSON.stringify(Number.isFinite(priceValue) ? Math.max(0, Math.round(priceValue)) : 0)};
        const plusSizeCode = '3XL';
        const plusSizeSurcharge = 200;
        const oversizeSurcharge = ${JSON.stringify(OVERSIZE_SURCHARGE)};
        const sizeChartRegular = {
            title: ${JSON.stringify(sizeChartTitle)},
            image: ${JSON.stringify(sizeChartImage)},
            alt: ${JSON.stringify(sizeChartAlt)}
        };
        const sizeChartOversize = {
            title: ${JSON.stringify(OVERSIZE_SIZE_CHART_TITLE)},
            image: ${JSON.stringify(OVERSIZE_SIZE_CHART_IMAGE)},
            alt: ${JSON.stringify(OVERSIZE_SIZE_CHART_ALT)}
        };

        const formatPrice = (value) => {
            const amount = Number(value || 0);
            return Math.round(amount).toLocaleString('uk-UA') + ' \u0433\u0440\u043d';
        };

        const getCurrentSizes = () => (fitMode === 'oversize' ? oversizeSizes : regularSizes);

        const renderSizeButtons = () => {
            if (!sizeOptionsEl) return;
            const list = getCurrentSizes();
            sizeOptionsEl.innerHTML = list.map((size) => {
                const isActive = size === selectedSize;
                return '<button'
                    + ' type="button"'
                    + ' class="product-card-v2__size ' + (isActive ? 'is-active' : '') + '"'
                    + ' data-product-size="' + size + '"'
                    + ' aria-pressed="' + (isActive ? 'true' : 'false') + '"'
                    + '>' + size + '</button>';
            }).join('');
        };

        const syncFitButtons = () => {
            fitButtons.forEach((button) => {
                const value = String(button.getAttribute('data-product-fit') || '').trim().toLowerCase();
                const isActive = value === fitMode;
                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
        };

        const updateDisplayedPrice = () => {
            if (!priceLabelEl || !Number.isFinite(basePrice)) return;
            let total = basePrice;
            if (fitMode === 'oversize') {
                total += oversizeSurcharge;
            } else if (selectedSize === plusSizeCode) {
                total += plusSizeSurcharge;
            }
            priceLabelEl.textContent = formatPrice(total);
        };

        if (sizeOptionsEl) {
            sizeOptionsEl.addEventListener('click', (event) => {
                const button = event.target.closest('[data-product-size]');
                if (!button) return;
                const value = String(button.getAttribute('data-product-size') || '').trim();
                if (!value) return;
                selectedSize = value;
                selectedSizeByFit[fitMode] = value;
                renderSizeButtons();
                updateDisplayedPrice();
            });
        }

        if (tshirtProduct && fitButtons.length) {
            fitButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const value = String(button.getAttribute('data-product-fit') || '').trim().toLowerCase();
                    if (value !== 'regular' && value !== 'oversize') return;
                    fitMode = value;
                    const list = getCurrentSizes();
                    selectedSize = selectedSizeByFit[fitMode] || list[0] || '';
                    selectedSizeByFit[fitMode] = selectedSize;
                    syncFitButtons();
                    renderSizeButtons();
                    updateDisplayedPrice();
                });
            });
        }

        renderSizeButtons();
        syncFitButtons();
        updateDisplayedPrice();

        const sizeChartBtn = document.getElementById('product-size-chart-btn');
        const sizeChartModal = document.getElementById('product-size-chart-modal');
        const sizeChartTitleEl = document.getElementById('product-size-chart-title');
        const sizeChartImageEl = document.getElementById('product-size-chart-image');
        const applySizeChartContent = () => {
            const config = (tshirtProduct && fitMode === 'oversize') ? sizeChartOversize : sizeChartRegular;
            if (sizeChartTitleEl) sizeChartTitleEl.textContent = config.title;
            if (sizeChartImageEl) {
                sizeChartImageEl.setAttribute('src', config.image);
                sizeChartImageEl.setAttribute('alt', config.alt);
            }
        };
        if (sizeChartBtn && sizeChartModal) {
            sizeChartBtn.addEventListener('click', () => {
                applySizeChartContent();
                sizeChartModal.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
            });

            sizeChartModal.querySelectorAll('[data-size-chart-close]').forEach((closeEl) => {
                closeEl.addEventListener('click', () => {
                    sizeChartModal.classList.add('hidden');
                    document.body.classList.remove('overflow-hidden');
                });
            });
        }

        const openImageLightbox = () => {
            if (!imageLightbox || !productMainImage || !imageLightboxImage) return;
            const source = productMainImage.getAttribute('src') || '';
            const alt = productMainImage.getAttribute('alt') || '';
            if (!source) return;

            imageLightboxImage.setAttribute('src', source);
            imageLightboxImage.setAttribute('alt', alt);
            imageLightbox.classList.remove('hidden');
            imageLightbox.setAttribute('aria-hidden', 'false');

            requestAnimationFrame(() => {
                imageLightbox.classList.add('is-open');
            });
            document.body.classList.add('overflow-hidden');
        };

        const closeImageLightbox = () => {
            if (!imageLightbox) return;
            imageLightbox.classList.remove('is-open');
            imageLightbox.setAttribute('aria-hidden', 'true');
            window.setTimeout(() => {
                imageLightbox.classList.add('hidden');
            }, 220);

            if (!sizeChartModal || sizeChartModal.classList.contains('hidden')) {
                document.body.classList.remove('overflow-hidden');
            }
        };

        if (productMainImage && imageLightbox) {
            productMainImage.addEventListener('click', openImageLightbox);
            productMainImage.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                openImageLightbox();
            });
        }

        if (imageLightboxBackdrop) {
            imageLightboxBackdrop.addEventListener('click', closeImageLightbox);
        }

        if (imageLightboxShell) {
            imageLightboxShell.addEventListener('click', (event) => {
                if (event.target !== imageLightboxShell) return;
                closeImageLightbox();
            });
        }

        if (imageLightboxClose) {
            imageLightboxClose.addEventListener('click', closeImageLightbox);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            if (!imageLightbox || imageLightbox.classList.contains('hidden')) return;
            closeImageLightbox();
        });

        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                try {
                    window.sessionStorage.setItem('upf_order_from_product', JSON.stringify({
                        slug,
                        size: selectedSize,
                        fit: fitMode,
                        quantity: 1
                    }));
                    window.sessionStorage.setItem('openCartOnHome', '1');
                } catch (_) {}

                window.location.href = '/index.html#products';
            });
        }
    })();
    </script>
    <script src="/js/ui-helpers.js"></script>
    <script src="/js/catalog.js"></script>
    <script src="/js/main.js"></script>
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
