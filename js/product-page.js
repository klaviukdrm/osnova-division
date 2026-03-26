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
