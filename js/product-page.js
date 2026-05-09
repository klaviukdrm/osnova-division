(function () {
    const BRAND_NAME = 'Ukrainian Print Family';

    function getSlugFromLocation() {
        const querySlug = new URLSearchParams(window.location.search).get('slug');
        const fromQuery = String(querySlug || '').trim();
        if (fromQuery) return decodeURIComponent(fromQuery).toLowerCase();

        const match = window.location.pathname.match(/^\/product\/([^/?#]+)/i);
        if (match && match[1]) {
            return decodeURIComponent(match[1]).trim().toLowerCase();
        }

        return '';
    }

    function toAbsoluteUrl(value) {
        const raw = String(value || '').trim();
        if (!raw) return '';
        try {
            return new URL(raw, window.location.origin).href;
        } catch (_) {
            return '';
        }
    }

    function setHeadMeta(product) {
        const title = String(product?.title || 'Товар').trim();
        const description = String(product?.description || `Сторінка товару «${title}»`).trim();
        const slug = String(product?.slug || '').trim();
        const image = String((Array.isArray(product?.gallery) && product.gallery[0]) || product?.image || '').trim();
        const canonical = slug ? `${window.location.origin}/product/${encodeURIComponent(slug)}` : `${window.location.origin}/product`;

        document.title = `${title} | ${BRAND_NAME}`;

        const setMeta = (selector, content) => {
            const node = document.querySelector(selector);
            if (!node || !content) return;
            node.setAttribute('content', content);
        };

        setMeta('meta[name="description"]', description);
        setMeta('meta[property="og:title"]', `${title} | ${BRAND_NAME}`);
        setMeta('meta[property="og:description"]', description);
        setMeta('meta[name="twitter:title"]', `${title} | ${BRAND_NAME}`);
        setMeta('meta[name="twitter:description"]', description);

        const absoluteImage = toAbsoluteUrl(image);
        if (absoluteImage) {
            setMeta('meta[property="og:image"]', absoluteImage);
            setMeta('meta[name="twitter:image"]', absoluteImage);
        }

        const canonicalEl = document.getElementById('canonical-link');
        if (canonicalEl) {
            canonicalEl.setAttribute('href', canonical);
        }
    }

    function showNotFound() {
        const loading = document.getElementById('product-page-loading');
        const notFound = document.getElementById('product-page-not-found');
        const content = document.getElementById('product-page-content');

        if (loading) loading.classList.add('hidden');
        if (content) content.classList.add('hidden');
        if (notFound) notFound.classList.remove('hidden');

        document.title = `Товар не знайдено | ${BRAND_NAME}`;
        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute('content', 'Товар не знайдено.');
        }
    }

    function isTshirtProduct(product, catalog) {
        if (typeof catalog?.isTshirtItem === 'function') {
            return Boolean(catalog.isTshirtItem(product));
        }

        const haystack = `${product?.category || ''} ${product?.displayCategory || ''} ${product?.title || ''}`.toLowerCase();
        return haystack.includes('футбол');
    }

    function getRegularSizes(product, catalog) {
        const fallback = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
        if (typeof catalog?.getCardMeta !== 'function') return fallback;

        const raw = catalog.getCardMeta(product, 0)?.sizes;
        if (!Array.isArray(raw)) return fallback;

        const list = raw.filter((size) => typeof size === 'string' && size.trim());
        if (!list.length) return fallback;
        if (list.length === 1 && String(list[0]).toUpperCase() === 'ONE SIZE') return [];
        return list;
    }

    function getSizeChartConfigForFit(catalog, fitMode) {
        const defaultConfig = catalog?.SIZE_CHART_CONFIG?.default || {
            title: 'Таблиця розмірів для футболок',
            image: 'images/Screenshot_214%20(1).png',
            alt: 'Розмірна сітка для футболок'
        };

        const oversizeConfig = catalog?.SIZE_CHART_CONFIG?.oversize || {
            title: 'Таблиця розмірів для oversize футболок',
            image: 'images/photo_2026-05-09_12-29-27.jpg',
            alt: 'Розмірна сітка для oversize футболок'
        };

        return fitMode === 'oversize' ? oversizeConfig : defaultConfig;
    }

    function setupProductSizeControls(product, catalog) {
        const controlsWrap = document.getElementById('product-size-controls');
        const fitToggle = document.getElementById('product-fit-toggle');
        const sizeOptions = document.getElementById('product-size-options');
        const priceEl = document.getElementById('product-price');
        const sizeChartButton = document.getElementById('product-size-chart-btn');
        const sizeChartModal = document.getElementById('product-size-chart-modal');
        const sizeChartBackdrop = document.getElementById('product-size-chart-backdrop');
        const sizeChartClose = document.getElementById('product-size-chart-close');
        const sizeChartTitle = document.getElementById('product-size-chart-title');
        const sizeChartImage = document.getElementById('product-size-chart-image');

        if (!controlsWrap || !fitToggle || !sizeOptions || !priceEl || !sizeChartButton) return;

        const tshirt = isTshirtProduct(product, catalog);
        if (!tshirt) {
            controlsWrap.classList.add('hidden');
            return;
        }

        const regularSizes = getRegularSizes(product, catalog);
        const oversizeSizes = Array.isArray(catalog?.OVERSIZE_SIZE_OPTIONS) && catalog.OVERSIZE_SIZE_OPTIONS.length
            ? catalog.OVERSIZE_SIZE_OPTIONS
            : ['S/M', 'L/XL'];
        const fallbackSurcharge = Number(catalog?.OVERSIZE_SURCHARGE);
        const oversizeSurcharge = Number.isFinite(fallbackSurcharge) ? fallbackSurcharge : 200;

        let fitMode = 'regular';
        const selectedByFit = {
            regular: regularSizes[0] || '',
            oversize: oversizeSizes[0] || ''
        };

        const formatPrice = (value) => {
            if (typeof catalog?.formatPrice === 'function') return catalog.formatPrice(value);
            const num = Number(value || 0);
            return `${Math.round(num)} грн`;
        };

        const updatePrice = () => {
            const selectedSize = selectedByFit[fitMode] || '';
            const calculated = typeof catalog?.getProductPrice === 'function'
                ? catalog.getProductPrice({ ...product, selectedSize }, selectedSize)
                : Number(product?.price || 0) + (fitMode === 'oversize' ? oversizeSurcharge : 0);
            priceEl.textContent = formatPrice(calculated);
        };

        const renderFitButtons = () => {
            fitToggle.innerHTML = `
                <button type="button" class="product-card-v2__fit-btn ${fitMode === 'regular' ? 'is-active' : ''}" data-product-fit="regular" aria-pressed="${fitMode === 'regular'}">regular</button>
                <button type="button" class="product-card-v2__fit-btn ${fitMode === 'oversize' ? 'is-active' : ''}" data-product-fit="oversize" aria-pressed="${fitMode === 'oversize'}">oversize</button>
            `;
        };

        const renderSizeButtons = () => {
            const list = fitMode === 'oversize' ? oversizeSizes : regularSizes;
            const active = selectedByFit[fitMode] || '';
            sizeOptions.innerHTML = list.map((size) => `
                <button
                    type="button"
                    class="product-card-v2__size ${size === active ? 'is-active' : ''}"
                    data-product-size="${encodeURIComponent(size)}"
                    aria-pressed="${size === active}"
                >${size}</button>
            `).join('');
        };

        const applySizeChart = () => {
            const config = getSizeChartConfigForFit(catalog, fitMode);
            if (sizeChartTitle) sizeChartTitle.textContent = config.title;
            if (sizeChartImage) {
                sizeChartImage.src = config.image;
                sizeChartImage.alt = config.alt;
            }
        };

        const openSizeChartModal = () => {
            if (!sizeChartModal) return;
            applySizeChart();
            sizeChartModal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        };

        const closeSizeChartModal = () => {
            if (!sizeChartModal) return;
            sizeChartModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        };

        fitToggle.onclick = (event) => {
            const button = event.target.closest('[data-product-fit]');
            if (!button) return;
            const next = String(button.getAttribute('data-product-fit') || '').trim().toLowerCase();
            if (next !== 'regular' && next !== 'oversize') return;
            fitMode = next;
            renderFitButtons();
            renderSizeButtons();
            updatePrice();
        };

        sizeOptions.onclick = (event) => {
            const button = event.target.closest('[data-product-size]');
            if (!button) return;
            const value = decodeURIComponent(button.getAttribute('data-product-size') || '');
            if (!value) return;
            selectedByFit[fitMode] = value;
            renderSizeButtons();
            updatePrice();
        };

        sizeChartButton.onclick = () => openSizeChartModal();
        if (sizeChartClose) sizeChartClose.onclick = () => closeSizeChartModal();
        if (sizeChartBackdrop) sizeChartBackdrop.onclick = () => closeSizeChartModal();

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && sizeChartModal && !sizeChartModal.classList.contains('hidden')) {
                closeSizeChartModal();
            }
        });

        controlsWrap.classList.remove('hidden');
        renderFitButtons();
        renderSizeButtons();
        updatePrice();
    }

    function renderProduct(product, catalog) {
        const loading = document.getElementById('product-page-loading');
        const notFound = document.getElementById('product-page-not-found');
        const content = document.getElementById('product-page-content');
        const titleEl = document.getElementById('product-title');
        const categoryEl = document.getElementById('product-category');
        const priceEl = document.getElementById('product-price');
        const descriptionEl = document.getElementById('product-description');
        const imageEl = document.getElementById('product-image');
        const openCatalog = document.getElementById('product-open-catalog');

        if (loading) loading.classList.add('hidden');
        if (notFound) notFound.classList.add('hidden');
        if (content) content.classList.remove('hidden');

        const category = typeof catalog?.getDisplayCategory === 'function'
            ? catalog.getDisplayCategory(product)
            : String(product?.category || 'Каталог');

        const price = typeof catalog?.formatPrice === 'function'
            ? catalog.formatPrice(product?.price)
            : `${Number(product?.price || 0)} грн`;

        const fullImage = (Array.isArray(product?.gallery) && product.gallery[0]) || product?.image || '';

        if (titleEl) titleEl.textContent = product?.title || 'Товар';
        if (categoryEl) categoryEl.textContent = category;
        if (priceEl) priceEl.textContent = price;
        if (descriptionEl) descriptionEl.textContent = product?.description || 'Опис товару відсутній.';
        if (imageEl) {
            imageEl.src = fullImage;
            imageEl.alt = product?.title || 'Товар';
        }
        if (openCatalog) {
            openCatalog.setAttribute('href', '/index.html#products');
        }

        setupProductSizeControls(product, catalog);
    }

    async function loadApiProducts(catalog) {
        try {
            const response = await fetch('/api/products', {
                method: 'GET',
                headers: { Accept: 'application/json' },
                cache: 'no-store'
            });
            if (!response.ok) return [];

            const payload = await response.json().catch(() => ({}));
            const source = Array.isArray(payload?.products) ? payload.products : [];
            return source
                .map((product) => {
                    if (typeof catalog?.mapApiProductToCatalog === 'function') {
                        return catalog.mapApiProductToCatalog(product);
                    }
                    return null;
                })
                .filter(Boolean);
        } catch (_) {
            return [];
        }
    }

    async function initProductPage() {
        const catalog = window.Catalog || null;
        if (!catalog) {
            showNotFound();
            return;
        }

        const requestedSlug = getSlugFromLocation();
        if (!requestedSlug) {
            showNotFound();
            return;
        }

        const staticProducts = typeof catalog.generateDemoProducts === 'function'
            ? catalog.generateDemoProducts(catalog.DEFAULT_CATEGORIES.slice())
            : [];
        const apiProducts = await loadApiProducts(catalog);
        const allProductsRaw = [...staticProducts, ...apiProducts];

        const allProducts = typeof catalog.assignProductSlugs === 'function'
            ? catalog.assignProductSlugs(allProductsRaw)
            : allProductsRaw;

        const product = allProducts.find((item) => String(item?.slug || '').toLowerCase() === requestedSlug);
        if (!product) {
            showNotFound();
            return;
        }

        setHeadMeta(product);
        renderProduct(product, catalog);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductPage);
    } else {
        initProductPage();
    }
})();
