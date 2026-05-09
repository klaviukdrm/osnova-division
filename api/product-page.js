const { getAllCatalogProducts } = require('./_lib/product-catalog');

const APPAREL_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
const HOODIE_SIZES = ['S', 'M', 'L', 'XL', '2XL'];
const OVERSIZE_SIZES = ['S/M', 'L/XL'];
const OVERSIZE_SURCHARGE = 200;
const OVERSIZE_SIZE_CHART_IMAGE = '/images/photo_2026-05-09_12-29-27.jpg';
const OVERSIZE_SIZE_CHART_ALT = 'Розмірна сітка для oversize футболок';
const OVERSIZE_SIZE_CHART_TITLE = 'Таблиця розмірів для oversize футболок';

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
    return haystack.includes('футбол');
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
    </style>
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
            <article class="product-page-layout grid lg:grid-cols-2 gap-10 items-start">
                <div class="product-page-image-wrap rounded-3xl overflow-hidden">
                    <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" class="product-page-image w-full rounded-3xl object-cover">
                </div>
                <div class="space-y-5">
                    <p class="text-xs uppercase tracking-[0.25em] text-slate-400">${escapeHtml(category)}</p>
                    <h1 class="text-3xl md:text-5xl font-bold section-title">${escapeHtml(title)}</h1>
                    <p id="product-price-label" class="text-3xl font-semibold text-emerald-600">${escapeHtml(priceLabel)}</p>
                    ${availableSizes.length ? `
                    <div class="pt-1">
                        <p class="product-card-v2__meta-label mb-2">Розмір</p>
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

                    <div class="pt-2 flex flex-wrap gap-3">
                        <button id="product-order-btn" type="button" class="product-page-btn product-page-btn--green">
                            <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
                            Додати в кошик
                        </button>
                        ${availableSizes.length ? `
                        <button id="product-size-chart-btn" type="button" class="product-page-btn product-page-btn--orange">
                            Таблиця розмірів
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
                        <img src="/images/photo_2025-09-24_14-16-02.jpg" alt="Логотип Ukrainian Print Family" class="w-full h-full object-cover">
                    </div>
                    <span class="text-2xl font-bold">Ukrainian Print Family</span>
                </div>
                <p class="text-slate-400 leading-relaxed">Сторінка конструктора для персоналізації друку на одязі та посуді.</p>
            </div>

            <div>
                <p class="font-medium mb-4">Швидкі посилання</p>
                <div class="space-y-2 text-slate-400 text-sm">
                    <a href="/index.html#products" class="block hover:text-white transition">Каталог</a>
                    <a href="/editor.html" class="block hover:text-white transition">Конструктор</a>
                    <a href="#contacts" class="block hover:text-white transition">Контакти</a>
                </div>
            </div>

            <div>
                <p class="font-medium mb-4">Зв'язатися з нами</p>
                <p class="text-slate-400">Хмельницький, Україна</p>
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
                <a href="/index.html#contacts" class="hover:text-white transition">Доставка і оплата</a>
                <span class="text-slate-600">•</span>
                <a href="/index.html#contacts" class="hover:text-white transition">Угода користувача</a>
                <span class="text-slate-600">•</span>
                <a href="/index.html#contacts" class="hover:text-white transition">Політика конфіденційності</a>
            </div>
        </div>

        <div class="text-center text-xs text-slate-500 mt-20">
            © 2026 Ukrainian Print Family. Усі права захищені.
        </div>
    </footer>

    ${availableSizes.length ? `
    <div id="product-size-chart-modal" class="fixed inset-0 z-[64] hidden">
        <button type="button" class="absolute inset-0 bg-slate-900/75" data-size-chart-close aria-label="Закрити"></button>
        <div class="relative max-w-4xl mx-auto mt-8 mb-8 bg-white rounded-3xl shadow-2xl p-5 md:p-7 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <button type="button" class="absolute top-4 right-4 w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:border-blue-700 transition" data-size-chart-close aria-label="Закрити">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="pr-12">
                <p class="text-xs uppercase tracking-[0.25em] text-slate-400">РОЗМІРНА СІТКА</p>
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
            return Math.round(amount).toLocaleString('uk-UA') + ' грн';
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

        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                try {
                    window.sessionStorage.setItem('upf_order_from_product', JSON.stringify({
                        slug,
                        size: selectedSize,
                        quantity: 1
                    }));
                    window.sessionStorage.setItem('openCartOnHome', '1');
                } catch (_) {}

                window.location.href = '/index.html#products';
            });
        }
    })();
    </script>
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
