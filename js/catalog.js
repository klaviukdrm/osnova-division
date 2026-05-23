const Catalog = {
    CART_STORAGE_KEY: 'upf_cart_v1',
    FAVORITES_STORAGE_KEY: 'upf_favorites_v1',
    PRODUCT_ORDER_STORAGE_KEY: 'upf_order_from_product',
    LIQPAY_PENDING_ORDER_STORAGE_KEY: 'upf_pending_liqpay_order',
    LIQPAY_PENDING_ORDER_MAX_AGE_MS: 24 * 60 * 60 * 1000,
    CATALOG_CACHE_KEY: 'upf_catalog_all_v4',
    CATALOG_CACHE_MAX_AGE_MS: 3 * 24 * 60 * 60 * 1000,
    ITEMS_PER_PAGE: 24,
    DEFAULT_CATEGORIES: [
        'Футболка з надруком',
        'Худі'
    ],
    DEMO_ADJECTIVES: ['Стильний', 'Преміум', 'Лімітований', 'Сезонний', 'Міський', 'Soft Touch'],
    DEMO_SERIES: ['серія', 'набір', 'дроп', 'варіант'],
    BASE_APPAREL_PRICE: 650,
    HIGH_APPAREL_PRICE: 750,
    PLUS_SIZE_SURCHARGE: 200,
    PLUS_SIZE_CODE: '3XL',
    OVERSIZE_SURCHARGE: 200,
    FIT_REGULAR: 'regular',
    FIT_OVERSIZE: 'oversize',
    OVERSIZE_SIZE_OPTIONS: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    SIZE_CHART_CONFIG: {
        default: {
            title: 'Таблиця розмірів для футболок',
            image: 'images/Screenshot_214%20(1).png',
            alt: 'Розмірна сітка для футболок'
        },
        oversize: {
            title: 'Таблиця розмірів для oversize футболок',
            image: 'images/photo_2026-05-14_11-09-43.jpg',
            alt: 'Розмірна сітка для oversize футболок'
        },
        hoodie: {
            title: 'Таблиця розмірів для худі',
            image: 'images/setkarozmera.jpg',
            alt: 'Розмірна сітка для худі'
        }
    },
    BASE_APPAREL_LABEL: 'Футболка з надруком',
    DOUBLE_SIDED_APPAREL_LABEL: 'Футболка з двостороннім надруком',
    HIGH_PRICE_APPAREL_DESIGNS: new Set([
        '9999',
        'CAPTAIN AMERICA',
        'DUNE 2',
        'KULYA V LOB',
        'TNMT',
        'ЖИТТЄЛЮБ',
        'ЗЕНИК',
        'ЩУР MOTHERS CHAMBER'
    ]),
    APPAREL_IMAGE_FILES: [
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
    ],
    state: {
        categories: [],
        products: [],
        activeCategory: null,
        searchQuery: '',
        page: 1,
        restoredPage: null,
        currentItem: null,
        currentModalSize: '',
        imageIndexes: {},
        selectedSizes: {},
        selectedFits: {},
        cartItems: [],
        favoriteKeys: new Set(),
        modalImageLoadToken: 0,
        currentSizeChartType: 'default'
    },

    getDemoVisual(category, index) {
        const normalized = String(category || '').toLowerCase();
        if (normalized.includes('термо')) return 'images/mug-thermo.svg';
        if (normalized.includes('чаш')) return index % 2 === 0 ? 'images/mug-metal.svg' : 'images/mug-thermo.svg';
        if (normalized.includes('худі')) return 'images/hoodie-black.svg';
        if (normalized.includes('сум')) return 'images/hoodie-black.svg';
        return index % 3 === 0 ? 'images/hoodie-black.svg' : 'images/muzhskaya-futbolka-belaya-1005.png';
    },

    getDemoDescription(category, title) {
        const normalized = String(category || '').toLowerCase();
        if (normalized.includes('термо')) {
            return `Готова термочашка ${title.toLowerCase()} з уже надрукованим вертикальним макетом.`;
        }
        if (normalized.includes('чаш')) {
            return `Готова керамічна чашка ${title.toLowerCase()} з друком під wrap або лого.`;
        }
        if (normalized.includes('худі')) {
            return `Готове худі ${title.toLowerCase()} з великим грудним принтом і лого-форматом.`;
        }
        return `${title} — готовий надрукований виріб, доступний для замовлення в каталозі.`;
    },

    getDemoPrice(category, index) {
        const normalized = String(category || '').toLowerCase();
        if (normalized.includes('термо')) return 589 + index * 20;
        if (normalized.includes('чаш')) return 449 + index * 15;
        if (normalized.includes('худі')) return 799 + index * 30;
        return 299 + index * 25;
    },

    toCatalogImagePath(fileName) {
        const normalized = String(fileName || '').trim();
        if (!normalized) return '';
        if (normalized.includes('%')) return `images/${normalized}`;
        return `images/${encodeURIComponent(normalized)}`;
    },

    toCatalogThumbPath(fileName) {
        const normalized = String(fileName || '').trim();
        if (!normalized) return '';
        if (normalized.includes('%')) return `images/thumbs/${normalized}`;
        return `images/thumbs/${encodeURIComponent(normalized)}`;
    },

    safeDecodeUriComponent(value) {
        try {
            return decodeURIComponent(value);
        } catch (_) {
            return value;
        }
    },

    normalizeSupabaseSignedImageUrl(parsedUrl) {
        if (!parsedUrl || !parsedUrl.pathname) return '';
        const signedPrefix = '/storage/v1/object/sign/';
        const pathname = String(parsedUrl.pathname || '');
        if (!pathname.startsWith(signedPrefix)) return '';

        const signedPath = pathname.slice(signedPrefix.length);
        const pathSegments = signedPath
            .split('/')
            .filter(Boolean)
            .map((segment) => this.safeDecodeUriComponent(segment));

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
    },

    normalizeAbsoluteImageUrl(value) {
        const raw = String(value || '').trim();
        if (!raw) return '';
        if (raw.startsWith('data:')) return raw;

        const withProtocol = raw.startsWith('//') ? `https:${raw}` : raw;
        try {
            const parsed = new URL(withProtocol, window.location.origin);
            const publicUrl = this.normalizeSupabaseSignedImageUrl(parsed);
            if (publicUrl) return publicUrl;

            const encodedPathname = parsed.pathname
                .split('/')
                .map((segment) => {
                    if (!segment) return segment;
                    return encodeURIComponent(this.safeDecodeUriComponent(segment));
                })
                .join('/');
            parsed.pathname = encodedPathname;
            return parsed.toString();
        } catch (_) {
            return raw;
        }
    },

    normalizeCatalogImagePath(value) {
        const raw = String(value || '').trim();
        if (!raw) return '';
        if (/^(https?:)?\/\//i.test(raw)) {
            return this.normalizeAbsoluteImageUrl(raw);
        }
        if (raw.startsWith('data:')) {
            return raw;
        }

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
                return encodeURIComponent(this.safeDecodeUriComponent(segment));
            })
            .join('/');

        return query ? `${encodedPath}?${query}` : encodedPath;
    },

    toThumbFromImagePath(imagePath) {
        const normalized = this.normalizeCatalogImagePath(imagePath);
        if (!normalized) return '';
        if (/^(https?:)?\/\//i.test(normalized) || normalized.startsWith('data:')) {
            return normalized;
        }
        if (normalized.startsWith('images/thumbs/')) {
            return normalized;
        }
        if (normalized.startsWith('images/')) {
            return `images/thumbs/${normalized.slice('images/'.length)}`;
        }
        return normalized;
    },

    mapApiProductToCatalog(product) {
        const price = Number(product?.price);
        const normalizedPrice = Number.isFinite(price) ? Math.max(0, Math.round(price)) : 0;
        const fullImage = this.normalizeCatalogImagePath(product?.image || '');
        const previewImage = this.toThumbFromImagePath(fullImage);
        const title = String(product?.title || '').trim() || 'Товар';
        const description = String(product?.description || '').trim() || `Готовий товар «${title}».`;
        const category = this.normalizeCatalogCategoryName(product?.category || this.BASE_APPAREL_LABEL);
        const subcategory = String(product?.subcategory || product?.displayCategory || product?.display_category || '').trim();
        const displayCategory = subcategory || (
            normalizedPrice >= this.HIGH_APPAREL_PRICE
                ? this.DOUBLE_SIDED_APPAREL_LABEL
                : this.BASE_APPAREL_LABEL
        );

        return {
            id: product?.id,
            title,
            price: normalizedPrice,
            image: fullImage || previewImage,
            previewImage: previewImage || fullImage,
            category,
            displayCategory,
            description,
            gallery: fullImage ? [fullImage] : [previewImage],
            previewGallery: previewImage ? [previewImage] : (fullImage ? [fullImage] : [])
        };
    },

    saveCatalogState() {
        try {
            window.sessionStorage.setItem('upf_catalog_state', JSON.stringify({
                page: this.state.page,
                activeCategory: this.state.activeCategory,
                searchQuery: this.state.searchQuery
            }));
        } catch (_) {}
    },

    applyFetchedProducts(sourceProducts) {
        const mappedProducts = sourceProducts
            .map((product) => ({
                ...this.mapApiProductToCatalog(product),
                source: 'api'
            }))
            .filter((product) => product?.title && Number.isFinite(Number(product?.price)));

        if (!mappedProducts.length) {
            return false;
        }

        const existingProducts = Array.isArray(this.state.products)
            ? this.state.products.filter((product) => product?.source !== 'api')
            : [];
        const mergedProducts = [...existingProducts, ...mappedProducts];

        const categoryOrder = [
            this.BASE_APPAREL_LABEL,
            'Худі'
        ];
        const uniqueCategories = [];
        const seen = new Set();
        const baseCategories = Array.isArray(this.state.categories) && this.state.categories.length
            ? [...this.state.categories]
            : this.DEFAULT_CATEGORIES.slice();

        [...baseCategories, ...mergedProducts.map((product) => String(product?.category || '').trim())].forEach((category) => {
            if (!category || seen.has(category)) return;
            seen.add(category);
            uniqueCategories.push(category);
        });
        
        // Update catalog data with fetched products
        this.setCatalogData(uniqueCategories, mergedProducts);
        return true;
    },

    async loadProductsFromApi() {
        const cacheKey = this.CATALOG_CACHE_KEY;
        const cacheTtlMs = this.CATALOG_CACHE_MAX_AGE_MS;
        const legacyCacheKey = 'upf_catalog_all_v3';

        let hasCached = false;
        let cachedProductsFingerprint = '';
        let hasFreshCache = false;
        let resolvedCachedProducts = [];

        const applyCacheIfPossible = (products, meta = {}) => {
            if (!Array.isArray(products) || !products.length) return false;
            this.applyFetchedProducts(products);
            hasCached = true;
            cachedProductsFingerprint = JSON.stringify(products);
            resolvedCachedProducts = products;
            hasFreshCache = Boolean(meta.isFresh);
            return true;
        };

        // 1. Швидке завантаження з локального кешу (v4 -> legacy v3 fallback)
        try {
            const cachedDataStr = window.localStorage.getItem(cacheKey);
            if (cachedDataStr) {
                const parsed = JSON.parse(cachedDataStr);
                const cachedProducts = Array.isArray(parsed?.products) ? parsed.products : [];
                const fetchedAt = Number(parsed?.fetchedAt || 0);
                const cacheAgeMs = Date.now() - fetchedAt;
                const isFreshCache = (
                    cachedProducts.length > 0
                    && Number.isFinite(fetchedAt)
                    && fetchedAt > 0
                    && cacheAgeMs >= 0
                    && cacheAgeMs <= cacheTtlMs
                );

                applyCacheIfPossible(cachedProducts, { isFresh: isFreshCache });
            }
        } catch (e) {
            console.warn('Failed to parse catalog cache', e);
        }

        if (!hasCached) {
            try {
                const legacyDataStr = window.localStorage.getItem(legacyCacheKey);
                if (legacyDataStr) {
                    const parsedLegacy = JSON.parse(legacyDataStr);
                    const legacyProducts = Array.isArray(parsedLegacy?.products)
                        ? parsedLegacy.products
                        : (Array.isArray(parsedLegacy) ? parsedLegacy : []);

                    if (applyCacheIfPossible(legacyProducts, { isFresh: false })) {
                        try {
                            window.localStorage.setItem(cacheKey, JSON.stringify({
                                products: legacyProducts,
                                fetchedAt: 0
                            }));
                        } catch (_) {}
                    }
                }
            } catch (e) {
                console.warn('Failed to parse legacy catalog cache', e);
            }
        }

        // 2. Фоновий запит до API (Перевірка оновлень)
        try {
            const response = await fetch(`/api/products`, {
                method: 'GET',
                headers: { Accept: 'application/json' },
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error(`API ${response.status}`);
            }

            const payload = await response.json();
            const sourceProducts = Array.isArray(payload?.products) ? payload.products : [];

            if (!sourceProducts.length) {
                return hasCached;
            }

            const freshProductsFingerprint = JSON.stringify(sourceProducts);

            // Якщо дані з сервера ідентичні кешованим, не перемальовуємо UI щоб уникнути блимання
            if (hasCached && freshProductsFingerprint === cachedProductsFingerprint) {
                if (!hasFreshCache) {
                    try {
                        window.localStorage.setItem(cacheKey, JSON.stringify({
                            products: resolvedCachedProducts,
                            fetchedAt: Date.now()
                        }));
                    } catch (_) {}
                }
                try {
                    window.localStorage.removeItem(legacyCacheKey);
                } catch (_) {}
                return true;
            }

            // Зберігаємо нові дані в кеш
            try {
                window.localStorage.setItem(cacheKey, JSON.stringify({
                    products: sourceProducts,
                    fetchedAt: Date.now()
                }));
                window.localStorage.removeItem(legacyCacheKey);
            } catch (_) {}

            this.applyFetchedProducts(sourceProducts);
            return true;
        } catch (error) {
            console.warn('Failed to load products from API. Keeping fallback catalog.', error);
            return hasCached;
        }
    },

    getDesignNameFromFile(fileName) {
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
    },

    extractDesignNameFromTitle(title) {
        const normalizedTitle = String(title || '').trim();
        if (!normalizedTitle) return '';

        const quotedMatch = normalizedTitle.match(/«([^»]+)»/);
        if (quotedMatch && quotedMatch[1]) {
            return quotedMatch[1].trim();
        }

        return normalizedTitle
            .replace(/^Футболка з принтом\s*/i, '')
            .trim();
    },

    getTitleSeed(value) {
        return Array.from(String(value || '')).reduce((acc, char, index) => {
            return acc + (char.codePointAt(0) || 0) * (index + 1);
        }, 0);
    },

    buildStaticProductDescription(title) {
        const designName = this.extractDesignNameFromTitle(title) || 'власним дизайном';
        const variantIndex = this.getTitleSeed(designName) % 3;

        const firstParts = [
            `Стильна футболка з принтом «${designName}» для повсякденного образу.`,
            `Футболка «${designName}» створена для тих, хто любить виразні принти.`,
            `Модель з принтом «${designName}» гарно поєднується з повсякденним гардеробом.`
        ];
        const secondParts = [
            'Якісний друк передає деталі зображення та зберігає насичені кольори.',
            'Щільний матеріал і чіткий друк забезпечують охайний вигляд щодня.',
            'Комфортний крій та стійкий друк роблять її зручною для регулярного носіння.'
        ];
        const thirdParts = [
            'Добрий вибір для фанатів оригінального мерчу.',
            'Підійде для тих, хто хоче підкреслити свій стиль.',
            'Ідеально для тих, хто шукає помітний дизайн на кожен день.'
        ];

        return `${firstParts[variantIndex]} ${secondParts[variantIndex]} ${thirdParts[variantIndex]}`;
    },

    normalizeApparelCategoryLabel(label) {
        const value = String(label || '').trim();
        if (!value) return 'Каталог';

        if (value === 'Футболки') {
            return this.BASE_APPAREL_LABEL;
        }

        if (value === 'Футболки з надруком') {
            return this.BASE_APPAREL_LABEL;
        }

        if (
            value === 'Футболки з двосторонним надруком'
            || value === 'Футболки з двостороннім надруком'
            || value === 'Футболка з двосторонним надруком'
        ) {
            return this.DOUBLE_SIDED_APPAREL_LABEL;
        }

        return value;
    },

    normalizeCatalogCategoryName(category) {
        const value = String(category || '').trim();
        if (!value) return this.BASE_APPAREL_LABEL;

        const lower = value.toLowerCase();
        if (lower === 'футболки' || lower === 'футболка з надруком' || lower === 'футболки з надруком') {
            return this.BASE_APPAREL_LABEL;
        }
        if (lower === 'худи') {
            return 'Худі';
        }
        if (lower === 'чашка') {
            return 'Чашки';
        }
        if (lower === 'термочашка') {
            return 'Термочашки';
        }
        if (lower === 'подарунковий набір') {
            return 'Подарункові набори';
        }
        if (lower === 'сумка-шопер' || lower === 'шопер') {
            return 'Сумки-шопери';
        }

        return value;
    },

    getDisplayCategory(item) {
        return this.normalizeApparelCategoryLabel(item?.displayCategory || item?.category || 'Каталог');
    },

    getCategoryChipLabel(name) {
        const normalized = this.normalizeApparelCategoryLabel(name);
        if (normalized === this.BASE_APPAREL_LABEL) {
            return 'Футболки';
        }
        return name;
    },

    getApparelProducts(category) {
        if (!category) return [];

        return this.APPAREL_IMAGE_FILES.map((fileName, index) => {
            const designName = this.getDesignNameFromFile(fileName);
            const fullImage = this.toCatalogImagePath(fileName);
            const previewImage = this.toCatalogThumbPath(fileName);
            const designKey = designName.toLocaleUpperCase('uk-UA');
            const isHighPrice = this.HIGH_PRICE_APPAREL_DESIGNS.has(designKey);
            const price = isHighPrice ? this.HIGH_APPAREL_PRICE : this.BASE_APPAREL_PRICE;
            const normalizedCategory = this.normalizeApparelCategoryLabel(category);
            const displayCategory = isHighPrice ? this.DOUBLE_SIDED_APPAREL_LABEL : normalizedCategory;
            const title = `Футболка з принтом «${designName}»`;

            return {
                title,
                price,
                image: previewImage,
                previewImage,
                category: normalizedCategory,
                displayCategory,
                description: this.buildStaticProductDescription(title),
                gallery: [fullImage],
                previewGallery: [previewImage]
            };
        });
    },

    generateDemoProducts(categories) {
        const items = [];
        const apparelCategory = categories[0] || this.DEFAULT_CATEGORIES[0];
        const apparelProducts = this.getApparelProducts(apparelCategory);

        if (apparelProducts.length) {
            items.push(...apparelProducts);
        }

        return items;
    },

    formatPrice(value) {
        if (value === null || value === undefined || value === '') {
            return 'ціна уточнюється';
        }

        const num = Number(value);
        return Number.isFinite(num) ? `${num.toLocaleString('uk-UA')} грн` : `${value} грн`;
    },

    slugifyProductTitle(value) {
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
    },

    assignProductSlugs(products) {
        const list = Array.isArray(products) ? products : [];
        const used = new Map();

        return list.map((item, index) => {
            if (!item || typeof item !== 'object') {
                return item;
            }

            const rawSlug = String(item.slug || '').trim();
            const fromRaw = rawSlug ? this.slugifyProductTitle(rawSlug) : '';
            const fromTitle = this.slugifyProductTitle(item.title);
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
    },

    getProductUrl(item) {
        const slug = String(item?.slug || '').trim();
        return slug ? `/product/${encodeURIComponent(slug)}` : '#';
    },

    normalizeQuantity(value) {
        const qty = Number(value);
        return Number.isFinite(qty) ? Math.max(1, Math.floor(qty)) : 1;
    },

    normalizeSizeCode(value) {
        return String(value || '').trim().toUpperCase().replace(/\s+/g, '');
    },

    normalizeFitMode(value) {
        return String(value || '').trim().toLowerCase() === this.FIT_OVERSIZE
            ? this.FIT_OVERSIZE
            : this.FIT_REGULAR;
    },

    isTshirtItem(item) {
        const haystack = [
            item?.category,
            item?.displayCategory,
            item?.title
        ].map((part) => String(part || '').toLowerCase()).join(' ');
        return haystack.includes('футбол');
    },

    getFitStorageKey(item) {
        return this.getCardKey(item);
    },

    getSelectedFit(item) {
        if (!this.isTshirtItem(item)) return this.FIT_REGULAR;
        const key = this.getFitStorageKey(item);
        const saved = this.normalizeFitMode(this.state.selectedFits[key]);
        this.state.selectedFits[key] = saved;
        return saved;
    },

    setSelectedFit(item, fit) {
        if (!this.isTshirtItem(item)) return;
        const key = this.getFitStorageKey(item);
        this.state.selectedFits[key] = this.normalizeFitMode(fit);
    },

    isOversizeSize(sizeValue) {
        const normalized = this.normalizeSizeCode(sizeValue);
        return this.OVERSIZE_SIZE_OPTIONS.some((entry) => this.normalizeSizeCode(entry) === normalized);
    },

    getSizeSurcharge(item, selectedSize = '', fit = '') {
        if (!this.isTshirtItem(item)) return 0;
        const fitMode = this.normalizeFitMode(fit || item?.selectedFit || this.getSelectedFit(item));
        if (fitMode === this.FIT_OVERSIZE) {
            return this.OVERSIZE_SURCHARGE;
        }
        const sizeCode = this.normalizeSizeCode(selectedSize || item?.selectedSize);
        return sizeCode === this.PLUS_SIZE_CODE ? this.PLUS_SIZE_SURCHARGE : 0;
    },

    getProductPrice(item, selectedSize = '', fit = '') {
        const price = Number(item?.price);
        const basePrice = Number.isFinite(price) ? price : 0;
        return basePrice + this.getSizeSurcharge(item, selectedSize, fit);
    },

    getProductIdentityKey(item) {
        if (!item || typeof item !== 'object') {
            return '';
        }

        if (item.customKey) {
            return `custom:${String(item.customKey).trim()}`;
        }

        const idValue = item.id ?? item.productId ?? item.apiId;
        const normalizedId = String(idValue ?? '').trim();
        if (normalizedId) {
            return `id:${normalizedId}`;
        }

        const slug = String(item.slug || '').trim().toLowerCase();
        if (slug) {
            return `slug:${slug}`;
        }

        const category = String(item.category || '').trim().toLowerCase();
        const title = String(item.title || '').trim().toLowerCase();
        return `${category}::${title}`;
    },

    getCartItemKey(item) {
        const baseKey = this.getProductIdentityKey(item);
        const sizeCode = this.normalizeSizeCode(item?.selectedSize);
        const sizeKey = sizeCode ? `::size:${sizeCode}` : '';
        const fitKey = this.isTshirtItem(item)
            ? `::fit:${this.normalizeFitMode(item?.selectedFit || this.getSelectedFit(item))}`
            : '';
        return `${baseKey}${fitKey}${sizeKey}`;
    },

    getFavoriteKey(item) {
        return this.getCartItemKey(item);
    },

    isFavoriteProduct(item) {
        return this.state.favoriteKeys.has(this.getFavoriteKey(item));
    },

    saveFavoritesToStorage() {
        try {
            const keys = Array.from(this.state.favoriteKeys.values());
            window.localStorage.setItem(this.FAVORITES_STORAGE_KEY, JSON.stringify(keys));
        } catch (error) {
            console.warn('Failed to save favorites.', error);
        }
    },

    loadFavoritesFromStorage() {
        try {
            const raw = window.localStorage.getItem(this.FAVORITES_STORAGE_KEY);
            if (!raw) {
                this.state.favoriteKeys = new Set();
                return;
            }

            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                this.state.favoriteKeys = new Set();
                return;
            }

            this.state.favoriteKeys = new Set(parsed.filter((value) => typeof value === 'string' && value));
        } catch (error) {
            console.warn('Failed to load favorites.', error);
            this.state.favoriteKeys = new Set();
        }
    },

    toggleFavorite(item) {
        const key = this.getFavoriteKey(item);
        if (!key) return false;

        if (this.state.favoriteKeys.has(key)) {
            this.state.favoriteKeys.delete(key);
            this.saveFavoritesToStorage();
            window.UI?.showToast?.('Прибрано з обраного', { tone: 'warning' });
            return false;
        }

        this.state.favoriteKeys.add(key);
        this.saveFavoritesToStorage();
        window.UI?.showToast?.('Додано в обране', { tone: 'success' });
        return true;
    },

    getCartItemsCount() {
        return this.state.cartItems.reduce((sum, entry) => sum + this.normalizeQuantity(entry.quantity), 0);
    },

    getCartTotal() {
        return this.state.cartItems.reduce((sum, entry) => {
            return sum + this.getProductPrice(entry.item) * this.normalizeQuantity(entry.quantity);
        }, 0);
    },

    updateCartBadge() {
        const count = this.getCartItemsCount();
        document.querySelectorAll('[data-cart-count]').forEach((badge) => {
            badge.textContent = String(count);
            badge.classList.toggle('hidden', count < 1);
        });
    },

    saveCartToStorage() {
        try {
            const payload = this.state.cartItems.map((entry) => ({
                item: entry.item,
                quantity: this.normalizeQuantity(entry.quantity)
            }));
            window.localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(payload));
        } catch (error) {
            console.warn('Failed to save cart.', error);
        }
    },

    loadCartFromStorage() {
        try {
            const raw = window.localStorage.getItem(this.CART_STORAGE_KEY);
            if (!raw) {
                this.state.cartItems = [];
                this.updateCartBadge();
                return;
            }

            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                this.state.cartItems = [];
                this.updateCartBadge();
                return;
            }

            this.state.cartItems = parsed
                .map((entry) => {
                    if (!entry || typeof entry !== 'object' || !entry.item || !entry.item.title) return null;

                    return {
                        item: entry.item,
                        quantity: this.normalizeQuantity(entry.quantity)
                    };
                })
                .filter(Boolean);

            this.updateCartBadge();
        } catch (error) {
            console.warn('Failed to load cart.', error);
            this.state.cartItems = [];
            this.updateCartBadge();
        }
    },

    addToCart(item, quantity = 1) {
        if (!item) return;

        const nextQty = this.normalizeQuantity(quantity);
        const key = this.getCartItemKey(item);
        const existingIndex = this.state.cartItems.findIndex((entry) => this.getCartItemKey(entry.item) === key);

        if (existingIndex >= 0) {
            this.state.cartItems[existingIndex].quantity = this.normalizeQuantity(this.state.cartItems[existingIndex].quantity + nextQty);
        } else {
            this.state.cartItems.push({
                item,
                quantity: nextQty
            });
        }

        this.saveCartToStorage();
        this.renderCartModal();
        this.updateCartBadge();
        window.UI?.showToast?.('Додано в кошик', { tone: 'success' });
    },

    setCartItemQuantity(itemKey, quantity) {
        const nextQty = this.normalizeQuantity(quantity);
        const entry = this.state.cartItems.find((cartEntry) => this.getCartItemKey(cartEntry.item) === itemKey);
        if (!entry) return;

        entry.quantity = nextQty;
        this.saveCartToStorage();
        this.renderCartModal();
        this.updateCartBadge();
    },

    removeCartItem(itemKey) {
        this.state.cartItems = this.state.cartItems.filter((entry) => this.getCartItemKey(entry.item) !== itemKey);
        this.saveCartToStorage();
        this.renderCartModal();
        this.updateCartBadge();
        window.UI?.showToast?.('Товар прибрано з кошика', { tone: 'warning' });
    },

    clearCart(notify = true) {
        this.state.cartItems = [];
        this.saveCartToStorage();
        this.renderCartModal();
        this.updateCartBadge();
        if (notify) {
            window.UI?.showToast?.('Кошик очищено', { tone: 'info' });
        }
    },

    getPendingProductOrder() {
        try {
            const raw = window.sessionStorage.getItem(this.PRODUCT_ORDER_STORAGE_KEY);
            if (!raw) return null;

            const parsed = JSON.parse(raw);
            const slug = String(parsed?.slug || '').trim().toLowerCase();
            const size = String(parsed?.size || '').trim();
            const fit = String(parsed?.fit || '').trim();
            const quantity = this.normalizeQuantity(parsed?.quantity);

            if (!slug) return null;
            return { slug, size, fit, quantity };
        } catch (_) {
            return null;
        }
    },

    clearPendingProductOrder() {
        try {
            window.sessionStorage.removeItem(this.PRODUCT_ORDER_STORAGE_KEY);
        } catch (_) {}
    },

    getPendingLiqPayOrder() {
        try {
            const raw = window.sessionStorage.getItem(this.LIQPAY_PENDING_ORDER_STORAGE_KEY);
            if (!raw) return null;

            const parsed = JSON.parse(raw);
            const orderId = String(parsed?.orderId || '').trim();
            const createdAt = Number(parsed?.createdAt || 0);

            if (!orderId || !Number.isFinite(createdAt)) return null;
            if ((Date.now() - createdAt) > this.LIQPAY_PENDING_ORDER_MAX_AGE_MS) return null;

            return { orderId };
        } catch (_) {
            return null;
        }
    },

    clearPendingLiqPayOrder() {
        try {
            window.sessionStorage.removeItem(this.LIQPAY_PENDING_ORDER_STORAGE_KEY);
        } catch (_) {}
    },

    async checkPendingLiqPayOrderReturn() {
        const pending = this.getPendingLiqPayOrder();
        if (!pending?.orderId) return;

        try {
            const response = await fetch(`/api/liqpay/status?orderId=${encodeURIComponent(pending.orderId)}`, {
                method: 'GET',
                headers: { Accept: 'application/json' },
                cache: 'no-store'
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) return;

            const status = String(result?.status || '').trim().toLowerCase();
            
            const successStatuses = ['success', 'sandbox', 'processing', 'wait_accept', 'wait_secure'];
            const failureStatuses = ['failure', 'error', 'reversed'];

            if (successStatuses.includes(status)) {
                this.clearPendingLiqPayOrder();
                this.clearCart(false);
                window.UI?.showOrderSuccessModal?.();
            } else if (failureStatuses.includes(status)) {
                this.clearPendingLiqPayOrder();
                window.UI?.showToast?.('Помилка оплати. Спробуйте ще раз.', { tone: 'warning' });
            }
        } catch (error) {
            console.warn('Failed to verify pending LiqPay order status.', error);
        }
    },

    applyPendingProductOrder() {
        const pending = this.getPendingProductOrder();
        if (!pending) return false;

        const product = this.state.products.find((item) => {
            const slug = String(item?.slug || '').trim().toLowerCase();
            return Boolean(slug) && slug === pending.slug;
        });

        if (!product) return false;

        if (pending.fit) {
            this.setSelectedFit(product, pending.fit);
        }
        const currentFit = this.getSelectedFit(product);

        const availableSizes = this.getAvailableSizes(product, currentFit);
        let selectedSize = '';

        if (availableSizes.length) {
            const requestedSize = String(pending.size || '').trim();
            selectedSize = availableSizes.includes(requestedSize)
                ? requestedSize
                : this.getSelectedSize(product, availableSizes, currentFit);
            this.setSelectedSize(product, selectedSize, currentFit);
        }

        this.addToCart({
            ...product,
            selectedSize,
            selectedFit: currentFit
        }, pending.quantity);

        this.clearPendingProductOrder();
        return true;
    },

    renderCartModal() {
        const list = document.getElementById('cart-items-list');
        const emptyState = document.getElementById('cart-empty-state');
        const total = document.getElementById('cart-total-price');
        const checkoutButton = document.getElementById('cart-checkout-btn');
        const clearButton = document.getElementById('cart-clear-btn');

        if (!list || !emptyState || !total || !checkoutButton || !clearButton) return;

        if (!this.state.cartItems.length) {
            list.innerHTML = '';
            emptyState.classList.remove('hidden');
            total.textContent = this.formatPrice(0);
            checkoutButton.disabled = true;
            checkoutButton.classList.add('opacity-60', 'pointer-events-none');
            clearButton.disabled = true;
            clearButton.classList.add('opacity-60', 'pointer-events-none');
            return;
        }

        emptyState.classList.add('hidden');
        checkoutButton.disabled = false;
        checkoutButton.classList.remove('opacity-60', 'pointer-events-none');
        clearButton.disabled = false;
        clearButton.classList.remove('opacity-60', 'pointer-events-none');
        total.textContent = this.formatPrice(this.getCartTotal());

        list.innerHTML = this.state.cartItems.map((entry) => {
            const item = entry.item || {};
            const quantity = this.normalizeQuantity(entry.quantity);
            const price = this.getProductPrice(item);
            const subtotal = price * quantity;
            const itemKey = encodeURIComponent(this.getCartItemKey(item));
            const image = this.getPrimaryImage(item);
            const fitLabel = item.selectedFit === 'oversize' ? ' (oversize)' : '';

            return `
                <article class="rounded-3xl border border-slate-200 p-4 md:p-5">
                    <div class="flex gap-4 items-start">
                        <div class="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                            <img src="${image}" alt="${item.title || 'Товар'}" class="w-full h-full object-contain">
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-lg font-semibold text-slate-900 leading-tight mt-1">${(item.title || 'Товар').includes(' • ') ? `<span>${item.title.split(' • ')[0]}</span> • <span>${item.title.split(' • ').slice(1).join(' • ')}</span>` : item.title || 'Товар'}</h4>
                            ${item.selectedSize ? `<p class="text-xs text-slate-500 mt-1"><span>Розмір:</span> ${item.selectedSize}${fitLabel}</p>` : ''}
                            <p class="text-sm text-slate-600 mt-1">${this.formatPrice(price)} x ${quantity}</p>
                        </div>
                        <p class="text-base md:text-lg font-semibold text-slate-900 shrink-0">${this.formatPrice(subtotal)}</p>
                    </div>
                    <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div class="inline-flex items-center rounded-2xl border border-slate-300 overflow-hidden">
                            <button type="button" class="px-3 py-2 text-slate-700 hover:bg-slate-100 transition" data-cart-action="decrease" data-cart-key="${itemKey}" aria-label="Зменшити кількість">−</button>
                            <span class="px-3 py-2 text-sm font-semibold text-slate-900 border-l border-r border-slate-200">${quantity}</span>
                            <button type="button" class="px-3 py-2 text-slate-700 hover:bg-slate-100 transition" data-cart-action="increase" data-cart-key="${itemKey}" aria-label="Збільшити кількість">+</button>
                        </div>
                        <button type="button" class="text-sm font-medium text-red-600 hover:text-red-700 transition" data-cart-action="remove" data-cart-key="${itemKey}">
                            Прибрати
                        </button>
                    </div>
                </article>
            `;
        }).join('') + `
            <div class="mt-4 pt-4 border-t border-slate-200">
                <style>
                    details.faq-anim[open] .faq-content {
                        animation: faqSmoothOpen 0.4s ease-out forwards;
                    }
                    @keyframes faqSmoothOpen {
                        0% { opacity: 0; max-height: 0; }
                        100% { opacity: 1; max-height: 500px; }
                    }
                </style>
                <details class="faq-anim group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                    <summary class="font-semibold text-slate-900 cursor-pointer select-none p-4 hover:bg-blue-700 hover:text-white transition-colors duration-300 outline-none flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
                        <span>ЧАСТІ ЗАПИТАННЯ</span>
                        <i class="fa-solid fa-chevron-down transition-all duration-300 group-open:rotate-180 text-slate-400 group-hover:text-white"></i>
                    </summary>
                    <div class="faq-content overflow-hidden">
                        <div class="p-4 pt-3 space-y-4 text-sm text-slate-700">
                            <div>
                                <p class="font-bold text-slate-900">Чи можна накладним платежем?</p>
                                <p class="mt-1">Ні, тільки повна передплата.</p>
                            </div>
                            <div>
                                <p class="font-bold text-slate-900">Скільки часу на відправку?</p>
                                <p class="mt-1">Протягом 2-5 робочих днів.</p>
                            </div>
                            <div>
                                <p class="font-bold text-slate-900">Як підібрати розмір?</p>
                                <p class="mt-1">Зайдіть у розмірну сітку для коректного вибору.</p>
                            </div>
                            <div>
                            <p class="font-bold text-slate-900">Як зрозуміти що замовлення прийняте?</p>
                                <p class="mt-1">Якщо оплата пройшла успішно то ваше замовлення прийшло до нас, та буде відправлено.</p>
                            </div>
                        </div>
                    </div>
                </details>
            </div>
        `;
    },

    setCatalogData(categories, products) {
        const nextCategories = (categories || []).filter(Boolean);
        const nextProducts = this.assignProductSlugs((products || []).filter(Boolean));
        this.state.categories = nextCategories;
        this.state.products = nextProducts;

        if (!this.state.activeCategory || !nextCategories.includes(this.state.activeCategory)) {
            this.state.activeCategory = nextCategories[0] || null;
            this.saveCatalogState();
        }

        this.renderCategories();
        this.syncSearchInput();
        this.renderProducts();
    },

    normalizeSearchValue(value) {
        return String(value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[`']/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    },
    getSearchTokens(value) {
        const normalized = this.normalizeSearchValue(value);
        if (!normalized) return [];
        return normalized.split(' ').filter(Boolean);
    },

    matchesSearchQuery(item) {
        const tokens = this.getSearchTokens(this.state.searchQuery);
        if (!tokens.length) return true;

        const haystack = this.normalizeSearchValue([
            item?.title,
            item?.category,
            item?.displayCategory,
            item?.subcategory
        ].join(' '));

        return tokens.every((token) => haystack.includes(token));
    },

    getFilteredProducts() {
        const byCategory = !this.state.activeCategory
            ? this.state.products
            : this.state.products.filter((item) => item.category === this.state.activeCategory);

        return byCategory.filter((item) => this.matchesSearchQuery(item));
    },

    syncSearchInput() {
        const input = document.getElementById('catalog-search-input');
        if (!input) return;
        const nextValue = String(this.state.searchQuery || '');
        if (input.value !== nextValue) {
            input.value = nextValue;
        }
    },

    setupSearchInput() {
        const input = document.getElementById('catalog-search-input');
        if (!input) return;

        this.syncSearchInput();
        input.addEventListener('input', (event) => {
            this.state.searchQuery = String(event?.target?.value || '');
            this.state.page = 1;
            this.state.restoredPage = null;
            this.saveCatalogState();
            this.renderProducts();
        });
    },    

    getCardKey(item) {
        return this.getProductIdentityKey(item) || `${item?.category || ''}::${item?.title || ''}`;
    },

    getCardImageIndex(item, galleryLength) {
        if (!galleryLength || galleryLength < 1) return 0;
        const key = this.getCardKey(item);
        const saved = Number(this.state.imageIndexes[key] || 0);
        return ((saved % galleryLength) + galleryLength) % galleryLength;
    },

    setCardImageIndex(item, nextIndex, galleryLength) {
        if (!galleryLength || galleryLength < 1) return;
        const key = this.getCardKey(item);
        this.state.imageIndexes[key] = ((nextIndex % galleryLength) + galleryLength) % galleryLength;
    },

    getSelectedSize(item, availableSizes = [], fit = this.getSelectedFit(item)) {
        const sizes = Array.isArray(availableSizes) ? availableSizes.filter(Boolean) : [];
        if (!sizes.length) return '';

        const fitMode = this.normalizeFitMode(fit);
        const key = `${this.getCardKey(item)}::fit:${fitMode}`;
        const current = this.state.selectedSizes[key];
        if (current && sizes.includes(current)) {
            return current;
        }

        const fallback = sizes[0];
        this.state.selectedSizes[key] = fallback;
        return fallback;
    },

    setSelectedSize(item, size, fit = this.getSelectedFit(item)) {
        if (!item || !size) return;
        const fitMode = this.normalizeFitMode(fit);
        const key = `${this.getCardKey(item)}::fit:${fitMode}`;
        this.state.selectedSizes[key] = size;
    },

    getCardMeta(item, index) {
        const source = `${item?.category || ''} ${item?.title || ''}`.toLowerCase();
        const seed = (item?.title || '').length + index * 11;
        const rating = (4.4 + (seed % 5) * 0.1).toFixed(1);
        const reviewCount = 75 + (seed % 280);
        const discount = 10 + (seed % 21);

        let colors = ['#111827', '#475569', '#a3a3a3', '#d4af37'];
        let sizes = ['ONE SIZE'];

        if (source.includes('худі')) {
            colors = ['#111827', '#374151', '#64748b', '#991b1b'];
            sizes = ['S', 'M', 'L', 'XL', '2XL'];
        } else if (source.includes('термо')) {
            colors = ['#111827', '#334155', '#0f766e', '#a16207'];
            sizes = ['350 мл', '450 мл', '500 мл'];
        } else if (source.includes('чаш')) {
            colors = ['#d1d5db', '#64748b', '#0f172a', '#334155'];
            sizes = ['300 мл', '400 мл', '500 мл'];
        } else {
            colors = ['#f8fafc', '#111827', '#1d4ed8', '#991b1b'];
            sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
        }

        return {
            rating,
            reviewCount,
            discount,
            isNew: index % 3 === 0,
            isBestSeller: index % 2 === 0,
            freeShipping: true,
            colors,
            sizes
        };
    },

    getAvailableSizes(item, fit = this.getSelectedFit(item)) {
        const fitMode = this.normalizeFitMode(fit);
        const sizes = (this.isTshirtItem(item) && fitMode === this.FIT_OVERSIZE)
            ? this.OVERSIZE_SIZE_OPTIONS
            : (this.getCardMeta(item, 0).sizes || []);
        const normalized = sizes.filter((size) => typeof size === 'string' && size.trim());
        if (normalized.length === 1 && normalized[0].toUpperCase() === 'ONE SIZE') {
            return [];
        }
        return normalized;
    },

    renderModalSizes(item) {
        const selectorWrap = document.getElementById('modal-size-selector');
        const fitWrap = document.getElementById('modal-fit-toggle');
        const optionsWrap = document.getElementById('modal-size-options');
        if (!selectorWrap || !optionsWrap || !fitWrap) return;

        const currentFit = this.getSelectedFit(item);
        const hasFitToggle = this.isTshirtItem(item);
        fitWrap.classList.toggle('hidden', !hasFitToggle);
        if (hasFitToggle) {
            fitWrap.innerHTML = `
                <button
                    type="button"
                    class="product-card-v2__fit-btn ${currentFit === this.FIT_REGULAR ? 'is-active' : ''}"
                    data-modal-fit="${this.FIT_REGULAR}"
                    aria-pressed="${currentFit === this.FIT_REGULAR}"
                >regular</button>
                <button
                    type="button"
                    class="product-card-v2__fit-btn ${currentFit === this.FIT_OVERSIZE ? 'is-active' : ''}"
                    data-modal-fit="${this.FIT_OVERSIZE}"
                    aria-pressed="${currentFit === this.FIT_OVERSIZE}"
                >oversize</button>
            `;
        } else {
            fitWrap.innerHTML = '';
        }

        const sizes = this.getAvailableSizes(item, currentFit);
        if (!sizes.length) {
            this.state.currentModalSize = '';
            selectorWrap.classList.add('hidden');
            optionsWrap.innerHTML = '';
            return;
        }

        let selected = this.state.currentModalSize;
        if (!selected || !sizes.includes(selected)) {
            selected = item?.selectedSize && sizes.includes(item.selectedSize)
                ? item.selectedSize
                : this.getSelectedSize(item, sizes, currentFit);
        }
        this.state.currentModalSize = selected;
        this.setSelectedSize(item, selected, currentFit);

        selectorWrap.classList.remove('hidden');
        optionsWrap.innerHTML = sizes.map((size) => `
            <button
                type="button"
                class="product-card-v2__size ${size === selected ? 'is-active' : ''}"
                data-modal-size="${encodeURIComponent(size)}"
                aria-pressed="${size === selected}"
            >${size}</button>
        `).join('');
    },

    renderCategories() {
        const container = document.getElementById('catalog-categories');
        if (!container) return;

        const items = this.state.categories.length ? this.state.categories : this.DEFAULT_CATEGORIES;
        if (!this.state.activeCategory && items.length) {
            this.state.activeCategory = items[0];
        }
        const isSingleCategory = items.length === 1;

        container.innerHTML = items.map((name) => {
            const isActive = name === this.state.activeCategory;
            const classes = isActive
                ? 'bg-blue-700 text-white border-blue-700 shadow'
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-700';
            const sizeClasses = isSingleCategory
                ? 'px-8 py-3 text-base'
                : 'px-4 py-2 text-sm';
            return `
                <button type="button" class="category-chip rounded-2xl border font-medium transition cursor-pointer ${sizeClasses} ${classes}" data-category="${encodeURIComponent(name)}" aria-pressed="${isActive}">
                    ${this.getCategoryChipLabel(name)}
                </button>
            `;
        }).join('');

        container.querySelectorAll('[data-category]').forEach((button) => {
            button.addEventListener('click', () => {
                this.state.activeCategory = decodeURIComponent(button.getAttribute('data-category'));
                this.state.page = 1;
                this.state.restoredPage = null;
                this.saveCatalogState();
                this.renderCategories();
                this.renderProducts();
            });
        });
    },

    renderPagination(totalItems) {
        const containers = [
            document.getElementById('catalog-pagination-top'),
            document.getElementById('catalog-pagination')
        ].filter(Boolean);
        if (!containers.length) return;

        const totalPages = Math.max(1, Math.ceil(totalItems / this.ITEMS_PER_PAGE));
        if (totalItems <= this.ITEMS_PER_PAGE) {
            containers.forEach((container) => {
                container.classList.add('hidden');
                container.innerHTML = '';
            });
            return;
        }

        const currentPage = Math.min(Math.max(1, this.state.page || 1), totalPages);
        this.state.page = currentPage;

        const prevDisabled = currentPage <= 1;
        const nextDisabled = currentPage >= totalPages;

        const pageButtons = Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNumber) => {
            const isActive = pageNumber === currentPage;
            const classes = isActive
                ? 'bg-blue-700 text-white border-blue-700 shadow'
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-700';

            return `
                <button
                    type="button"
                    class="category-chip min-w-[2.35rem] h-10 px-3 rounded-2xl border text-sm font-semibold transition ${classes}"
                    data-page="${pageNumber}"
                    aria-current="${isActive ? 'page' : 'false'}"
                >${pageNumber}</button>
            `;
        }).join('');

        const markup = `
            <button
                type="button"
                class="category-chip h-10 px-3 rounded-2xl border text-sm font-medium transition ${prevDisabled ? 'opacity-45 pointer-events-none' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-700'}"
                data-page="${currentPage - 1}"
                ${prevDisabled ? 'disabled' : ''}
            >Назад</button>
            ${pageButtons}
            <button
                type="button"
                class="category-chip h-10 px-3 rounded-2xl border text-sm font-medium transition ${nextDisabled ? 'opacity-45 pointer-events-none' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-700'}"
                data-page="${currentPage + 1}"
                ${nextDisabled ? 'disabled' : ''}
            >Вперед</button>
        `;

        containers.forEach((container) => {
            container.classList.remove('hidden');
            container.innerHTML = markup;

            container.querySelectorAll('[data-page]').forEach((button) => {
                button.addEventListener('click', () => {
                    const nextPage = Number(button.getAttribute('data-page'));
                    if (!Number.isFinite(nextPage) || nextPage < 1 || nextPage > totalPages || nextPage === this.state.page) {
                        return;
                    }

                    this.state.page = nextPage;
                    this.state.restoredPage = null;
                    this.saveCatalogState();
                    this.renderProducts();
                    window.UI?.smoothScrollTo?.('products');
                });
            });
        });
    },

    renderProducts() {
        const grid = document.getElementById('catalog-grid');
        const empty = document.getElementById('catalog-empty');
        if (!grid || !empty) return;

        const filteredList = this.getFilteredProducts();
        if (!filteredList.length) {
            empty.classList.remove('hidden');
            if (this.getSearchTokens(this.state.searchQuery).length) {
                empty.textContent = 'Нічого не знайдено за цим запитом.';
            } else {
                empty.textContent = 'Поки що немає товарів. Додай їх у CMS.';
            }
            grid.innerHTML = '';
            this.renderPagination(0);
            return;
        }

        empty.textContent = 'Поки що немає товарів. Додай їх у CMS.';
        const totalPages = Math.max(1, Math.ceil(filteredList.length / this.ITEMS_PER_PAGE));

        if (this.state.restoredPage) {
            if (this.state.restoredPage <= totalPages) {
                this.state.page = this.state.restoredPage;
                this.state.restoredPage = null;
            } else {
                this.state.page = totalPages;
            }
        } else {
            let pageChanged = false;
            if (!Number.isFinite(this.state.page) || this.state.page < 1) {
                this.state.page = 1;
                pageChanged = true;
            }
            if (this.state.page > totalPages) {
                this.state.page = totalPages;
                pageChanged = true;
            }
            if (pageChanged) {
                this.saveCatalogState();
            }
        }

        const startIndex = (this.state.page - 1) * this.ITEMS_PER_PAGE;
        const list = filteredList.slice(startIndex, startIndex + this.ITEMS_PER_PAGE);

        empty.classList.add('hidden');
        grid.innerHTML = list.map((item, index) => `
            ${(() => {
                const previewGallery = this.buildPreviewGalleryUrls(item);
                const fullGallery = this.buildGalleryUrls(item);
                const galleryLength = previewGallery.length || 1;
                const imageIndex = this.getCardImageIndex(item, galleryLength);
                const activeImage = previewGallery[imageIndex] || this.getPrimaryPreviewImage(item);
                const activeFullImage = fullGallery[imageIndex] || this.getPrimaryImage(item);
                const meta = this.getCardMeta(item, startIndex + index);
                const selectedFit = this.getSelectedFit(item);
                const availableSizes = this.getAvailableSizes(item, selectedFit);
                const selectedSize = this.getSelectedSize(item, availableSizes, selectedFit);
                const displayPrice = this.getProductPrice(item, selectedSize);
                return `
            <article class="product-card product-card-v2 bg-white rounded-3xl overflow-hidden border border-slate-200 text-left transition" data-index="${index}">
                <div class="product-card-v2__media" data-action="open-product-page" data-index="${index}">
                    <img src="${activeImage}" data-full-image="${activeFullImage}" alt="${item.title || 'Товар'}" class="w-full h-full object-cover" loading="lazy" decoding="async" onerror="window.Catalog&&window.Catalog.handleCardImageError&&window.Catalog.handleCardImageError(this)">

                    ${galleryLength > 1 ? `
                    <div class="product-card-v2__nav">
                        <button type="button" class="product-card-v2__nav-btn" data-action="prev-image" data-index="${index}" data-gallery-length="${galleryLength}" aria-label="Попереднє фото">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>
                        <button type="button" class="product-card-v2__nav-btn" data-action="next-image" data-index="${index}" data-gallery-length="${galleryLength}" aria-label="Наступне фото">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="product-card-v2__dots">
                        ${previewGallery.map((_, dotIndex) => `
                            <button type="button" class="product-card-v2__dot ${dotIndex === imageIndex ? 'is-active' : ''}" data-action="set-image" data-index="${index}" data-image-index="${dotIndex}" data-gallery-length="${galleryLength}" aria-label="Фото ${dotIndex + 1}"></button>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>

                <div class="product-card-v2__body p-6 space-y-3">
                    <p class="font-semibold text-lg leading-snug text-slate-900">
                        <a href="${this.getProductUrl(item)}" class="hover:text-blue-700 transition">${item.title || 'Товар'}</a>
                    </p>

                    <div class="product-card-v2__price-row">
                        <span class="product-card-v2__price">${this.formatPrice(displayPrice)}</span>
                    </div>

                    <div class="product-card-v2__meta-group">
                        <div>
                            <p class="product-card-v2__meta-label">Розміри</p>
                            ${this.isTshirtItem(item) ? `
                                <div class="product-card-v2__fit-toggle">
                                    <button
                                        type="button"
                                        class="product-card-v2__fit-btn ${selectedFit === this.FIT_REGULAR ? 'is-active' : ''}"
                                        data-action="select-fit"
                                        data-index="${index}"
                                        data-fit="${this.FIT_REGULAR}"
                                        aria-pressed="${selectedFit === this.FIT_REGULAR}"
                                    >regular</button>
                                    <button
                                        type="button"
                                        class="product-card-v2__fit-btn ${selectedFit === this.FIT_OVERSIZE ? 'is-active' : ''}"
                                        data-action="select-fit"
                                        data-index="${index}"
                                        data-fit="${this.FIT_OVERSIZE}"
                                        aria-pressed="${selectedFit === this.FIT_OVERSIZE}"
                                    >oversize</button>
                                </div>
                            ` : ''}
                            <div class="product-card-v2__sizes">
                                ${availableSizes.map((size) => `
                                    <button
                                        type="button"
                                        class="product-card-v2__size ${size === selectedSize ? 'is-active' : ''}"
                                        data-action="select-size"
                                        data-index="${index}"
                                        data-size="${encodeURIComponent(size)}"
                                        aria-pressed="${size === selectedSize}"
                                    >${size}</button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="product-card-v2__footer px-6 pb-6 pt-1">
                    <button type="button" class="liquid-glass-btn product-card-v2__order-btn" data-action="order-product" data-index="${index}">
                        <i class="fa-solid fa-cart-shopping"></i>
                        Додати в кошик
                    </button>
                </div>
            </article>
                `;
            })()}
        `).join('');

        grid.onclick = (event) => {
            const actionElement = event.target.closest('[data-action]');
            if (!actionElement) return;

            const action = actionElement.getAttribute('data-action');
            const index = Number(actionElement.getAttribute('data-index'));
            if (!Number.isFinite(index) || !list[index]) return;

            const item = list[index];

            if (action === 'open-product-page') {
                const nextUrl = this.getProductUrl(item);
                if (nextUrl && nextUrl !== '#') {
                    window.location.href = nextUrl;
                }
                return;
            }

            if (action === 'order-product') {
                const selectedFit = this.getSelectedFit(item);
                const selectedSize = this.getSelectedSize(item, this.getAvailableSizes(item, selectedFit), selectedFit);
                this.addToCart({
                    ...item,
                    selectedSize,
                    selectedFit
                }, 1);
                return;
            }

            if (action === 'select-fit') {
                const fitMode = this.normalizeFitMode(actionElement.getAttribute('data-fit') || this.FIT_REGULAR);
                this.setSelectedFit(item, fitMode);
                const sizes = this.getAvailableSizes(item, fitMode);
                const selectedSize = this.getSelectedSize(item, sizes, fitMode);
                this.setSelectedSize(item, selectedSize, fitMode);
                this.renderProducts();
                return;
            }

            if (action === 'select-size') {
                const selectedSize = decodeURIComponent(actionElement.getAttribute('data-size') || '');
                if (!selectedSize) return;
                const selectedFit = this.getSelectedFit(item);
                this.setSelectedSize(item, selectedSize, selectedFit);
                this.renderProducts();
                return;
            }

            const galleryLength = Number(actionElement.getAttribute('data-gallery-length')) || this.buildPreviewGalleryUrls(item).length || 1;
            const currentIndex = this.getCardImageIndex(item, galleryLength);

            if (action === 'prev-image') {
                this.setCardImageIndex(item, currentIndex - 1, galleryLength);
                this.renderProducts();
                return;
            }

            if (action === 'next-image') {
                this.setCardImageIndex(item, currentIndex + 1, galleryLength);
                this.renderProducts();
                return;
            }

            if (action === 'set-image') {
                const imageIndex = Number(actionElement.getAttribute('data-image-index') || 0);
                this.setCardImageIndex(item, imageIndex, galleryLength);
                this.renderProducts();
            }
        };

        this.renderPagination(filteredList.length);
    },

    handleCardImageError(imageElement) {
        if (!imageElement) return;

        const fullImage = String(imageElement.getAttribute('data-full-image') || '').trim();
        const fallbackImage = 'images/muzhskaya-futbolka-belaya-1005.png';
        const currentSrc = String(imageElement.getAttribute('src') || '').trim();
        const attempt = Number.parseInt(String(imageElement.dataset.fallbackAttempt || '0'), 10) || 0;

        if (attempt < 1 && fullImage && currentSrc !== fullImage) {
            imageElement.dataset.fallbackAttempt = '1';
            imageElement.setAttribute('src', fullImage);
            return;
        }

        if (attempt < 2 && fallbackImage && currentSrc !== fallbackImage) {
            imageElement.dataset.fallbackAttempt = '2';
            imageElement.setAttribute('src', fallbackImage);
            return;
        }

        imageElement.onerror = null;
    },

    getPrimaryImage(item) {
        if (item.image) return item.image;
        if (item.previewImage) return item.previewImage;
        return this.getDemoVisual(item.category, 0);
    },

    getPrimaryPreviewImage(item) {
        if (item.previewImage) return item.previewImage;
        return this.getPrimaryImage(item);
    },

    buildGalleryUrls(item) {
        if (Array.isArray(item.gallery) && item.gallery.length) {
            return item.gallery.map((entry) => {
                if (typeof entry === 'string') return entry;
                if (entry && typeof entry === 'object' && typeof entry.url === 'string') return entry.url;
                return null;
            }).filter(Boolean);
        }

        const image = this.getPrimaryImage(item);
        return image ? [image] : [];
    },

    buildPreviewGalleryUrls(item) {
        if (Array.isArray(item.previewGallery) && item.previewGallery.length) {
            return item.previewGallery.map((entry) => {
                if (typeof entry === 'string') return entry;
                if (entry && typeof entry === 'object' && typeof entry.url === 'string') return entry.url;
                return null;
            }).filter(Boolean);
        }

        if (item?.previewImage) {
            return [item.previewImage];
        }

        const image = this.getPrimaryPreviewImage(item);
        return image ? [image] : [];
    },

    buildModalGalleryPairs(item) {
        const fullGallery = this.buildGalleryUrls(item);
        const previewGallery = this.buildPreviewGalleryUrls(item);
        const maxLength = Math.max(fullGallery.length, previewGallery.length, 1);
        const pairs = [];

        for (let index = 0; index < maxLength; index += 1) {
            const full = fullGallery[index] || fullGallery[0] || previewGallery[index] || previewGallery[0] || '';
            const preview = previewGallery[index] || previewGallery[0] || full;
            if (!full && !preview) continue;
            pairs.push({ full, preview });
        }

        return pairs;
    },

    loadModalMainImage(mainImageEl, imagePair) {
        if (!mainImageEl || !imagePair) return;

        const fullUrl = String(imagePair.full || '').trim();
        const previewUrl = String(imagePair.preview || '').trim() || fullUrl;
        const loadToken = (this.state.modalImageLoadToken || 0) + 1;
        this.state.modalImageLoadToken = loadToken;

        if (!fullUrl && !previewUrl) {
            mainImageEl.removeAttribute('src');
            return;
        }

        if (!fullUrl || fullUrl === previewUrl) {
            mainImageEl.src = fullUrl || previewUrl;
            return;
        }

        if (previewUrl) {
            mainImageEl.src = previewUrl;
        }

        const preloader = new Image();
        preloader.decoding = 'async';
        preloader.loading = 'eager';
        preloader.fetchPriority = 'low';
        preloader.onload = () => {
            if (this.state.modalImageLoadToken !== loadToken) return;
            mainImageEl.src = fullUrl;
        };
        preloader.onerror = () => {
            if (this.state.modalImageLoadToken !== loadToken) return;
            if (previewUrl) mainImageEl.src = previewUrl;
        };
        preloader.src = fullUrl;
    },

    openProductModal(item) {
        const modal = document.getElementById('product-modal');
        if (!modal) return;

        this.state.currentItem = item;
        this.state.currentModalSize = item?.selectedSize || '';
        this.applySizeChartConfig(item);
        const galleryPairs = this.buildModalGalleryPairs(item);
        const title = item.title || 'Товар';
        const category = this.getDisplayCategory(item);
        const description = item.description || 'Готовий надрукований товар.';

        const titleEl = document.getElementById('modal-title');
        const categoryEl = document.getElementById('modal-category');
        const priceEl = document.getElementById('modal-price');
        const descriptionEl = document.getElementById('modal-description');
        const detailCategoryEl = document.getElementById('modal-detail-category');
        const detailNoteEl = document.getElementById('modal-detail-note');
        const mainImageEl = document.getElementById('modal-main-image');
        const thumbsEl = document.getElementById('modal-thumbs');

        if (titleEl) titleEl.textContent = title;
        if (categoryEl) categoryEl.style.display = 'none';
        if (priceEl) priceEl.textContent = this.formatPrice(this.getProductPrice(item, this.state.currentModalSize));
        if (descriptionEl) descriptionEl.textContent = description;
        if (detailCategoryEl) {
            const parentCard = detailCategoryEl.closest('.preview-detail-card');
            if (parentCard) parentCard.style.display = 'none';
        }
        if (detailNoteEl) detailNoteEl.textContent = 'Оформлення цього товару без переходу в редактор.';
        if (mainImageEl) {
            mainImageEl.alt = title;
            mainImageEl.loading = 'lazy';
            mainImageEl.decoding = 'async';
            this.loadModalMainImage(mainImageEl, galleryPairs[0]);
        }

        if (thumbsEl) {
            if (galleryPairs.length <= 1) {
                thumbsEl.innerHTML = '';
                thumbsEl.classList.add('hidden');
            } else {
                thumbsEl.classList.remove('hidden');
                thumbsEl.innerHTML = galleryPairs.map((pair, index) => `
                    <button type="button" class="rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-700 transition ${index === 0 ? 'border-blue-700' : ''}" data-thumb-index="${index}">
                        <img src="${pair.preview || pair.full}" alt="${title} ${index + 1}" class="w-full h-20 object-contain bg-slate-50" loading="lazy" decoding="async">
                    </button>
                `).join('');

                thumbsEl.querySelectorAll('[data-thumb-index]').forEach((button) => {
                    button.addEventListener('click', () => {
                        const index = Number(button.getAttribute('data-thumb-index') || 0);
                        const pair = galleryPairs[index];
                        if (mainImageEl && pair) {
                            this.loadModalMainImage(mainImageEl, pair);
                        }
                        thumbsEl.querySelectorAll('[data-thumb-index]').forEach((itemButton) => itemButton.classList.remove('border-blue-700'));
                        button.classList.add('border-blue-700');
                    });
                });
            }
        }

        this.renderModalSizes(item);
        if (priceEl) priceEl.textContent = this.formatPrice(this.getProductPrice(item, this.state.currentModalSize));

        window.UI?.openModal('product-modal');
    },

    closeProductModal() {
        window.UI?.closeModal('product-modal');
    },

    isHoodieItem(item) {
        const haystack = `${item?.category || ''} ${item?.displayCategory || ''} ${item?.subcategory || ''} ${item?.title || ''}`
            .toLowerCase();
        return haystack.includes('худі') || haystack.includes('худи') || haystack.includes('hoodie');
    },

    getSizeChartConfig(item = this.state.currentItem) {
        if (this.isHoodieItem(item)) {
            return this.SIZE_CHART_CONFIG.hoodie;
        }
        if (this.isTshirtItem(item) && this.getSelectedFit(item) === this.FIT_OVERSIZE) {
            return this.SIZE_CHART_CONFIG.oversize;
        }
        return this.SIZE_CHART_CONFIG.default;
    },

    applySizeChartConfig(item = this.state.currentItem) {
        const config = this.getSizeChartConfig(item);
        const titleEl = document.getElementById('size-chart-title');
        const imageEl = document.getElementById('size-chart-image');

        if (config === this.SIZE_CHART_CONFIG.hoodie) {
            this.state.currentSizeChartType = 'hoodie';
        } else if (config === this.SIZE_CHART_CONFIG.oversize) {
            this.state.currentSizeChartType = 'oversize';
        } else {
            this.state.currentSizeChartType = 'default';
        }

        if (titleEl) titleEl.textContent = config.title;
        if (imageEl) {
            imageEl.src = config.image;
            imageEl.alt = config.alt;
        }
    },

    openSizeChartModal() {
        this.applySizeChartConfig(this.state.currentItem);
        window.UI?.openModal('size-chart-modal');
    },

    closeSizeChartModal() {
        window.UI?.closeModal('size-chart-modal');
    },

    openCartModal() {
        this.loadCartFromStorage();
        this.loadFavoritesFromStorage();
        this.renderCartModal();
        window.UI?.openModal('cart-modal');
    },

    closeCartModal() {
        window.UI?.closeModal('cart-modal');
    },

    openOrderModal() {
        if (!this.state.cartItems.length) {
            window.UI?.showToast?.('Додайте хоча б один товар у кошик.', { tone: 'warning' });
            return;
        }

        const itemsCountEl = document.getElementById('order-items-count');
        const totalPriceEl = document.getElementById('order-total-price');
        const fullNameInput = document.getElementById('order-full-name');
        const cityInput = document.getElementById('order-city');
        const shippingInput = document.getElementById('order-shipping');
        const phoneInput = document.getElementById('order-phone');
        const commentInput = document.getElementById('order-comment');
        const orderHint = document.getElementById('order-note-hint');
        if (itemsCountEl) itemsCountEl.textContent = String(this.getCartItemsCount());
        if (totalPriceEl) totalPriceEl.textContent = this.formatPrice(this.getCartTotal());
        if (fullNameInput && !fullNameInput.value) fullNameInput.value = '';
        if (cityInput && !cityInput.value) cityInput.value = '';
        if (phoneInput && !phoneInput.value) phoneInput.value = '';
        if (shippingInput && !shippingInput.value) shippingInput.value = '';
        if (commentInput && !commentInput.value) commentInput.value = '';
        if (orderHint) {
            orderHint.textContent = '';
        }

        window.UI?.openModal('order-modal');
    },

    closeOrderModal() {
        window.UI?.closeModal('order-modal');
    },

    setupModalEvents() {
        const modal = document.getElementById('product-modal');
        if (!modal) return;

        const closeButton = document.getElementById('modal-close');
        const backdrop = modal.querySelector('[data-close-modal]');
        const orderButton = document.getElementById('modal-order-btn');
        const sizeChartButton = document.getElementById('modal-size-chart-btn');
        const sizeChartModal = document.getElementById('size-chart-modal');
        const sizeChartCloseButton = document.getElementById('size-chart-close');
        const sizeChartBackdrop = sizeChartModal?.querySelector('[data-close-size-chart]');

        if (closeButton) closeButton.addEventListener('click', () => this.closeProductModal());
        if (backdrop) backdrop.addEventListener('click', () => this.closeProductModal());
        if (orderButton) {
            orderButton.addEventListener('click', () => {
                if (!this.state.currentItem) return;
                const itemToCart = { ...this.state.currentItem };
                const selectedFit = this.getSelectedFit(itemToCart);
                const sizes = this.getAvailableSizes(itemToCart, selectedFit);
                const selectedSize = this.state.currentModalSize || (sizes.length ? this.getSelectedSize(itemToCart, sizes, selectedFit) : '');
                if (selectedSize) {
                    itemToCart.selectedSize = selectedSize;
                    this.setSelectedSize(itemToCart, selectedSize, selectedFit);
                }
                itemToCart.selectedFit = selectedFit;
                this.addToCart(itemToCart, 1);
                this.closeProductModal();
            });
        }
        modal.addEventListener('click', (event) => {
            const fitButton = event.target.closest('[data-modal-fit]');
            if (fitButton && this.state.currentItem) {
                const nextFit = this.normalizeFitMode(fitButton.getAttribute('data-modal-fit') || this.FIT_REGULAR);
                this.setSelectedFit(this.state.currentItem, nextFit);
                const sizes = this.getAvailableSizes(this.state.currentItem, nextFit);
                const nextSize = sizes.length ? this.getSelectedSize(this.state.currentItem, sizes, nextFit) : '';
                this.state.currentModalSize = nextSize;
                if (nextSize) {
                    this.setSelectedSize(this.state.currentItem, nextSize, nextFit);
                }
                this.renderModalSizes(this.state.currentItem);
                this.applySizeChartConfig(this.state.currentItem);
                const priceEl = document.getElementById('modal-price');
                if (priceEl) {
                    priceEl.textContent = this.formatPrice(this.getProductPrice(this.state.currentItem, nextSize));
                }
                return;
            }

            const sizeButton = event.target.closest('[data-modal-size]');
            if (!sizeButton || !this.state.currentItem) return;
            const nextSize = decodeURIComponent(sizeButton.getAttribute('data-modal-size') || '');
            if (!nextSize) return;
            this.state.currentModalSize = nextSize;
            const selectedFit = this.getSelectedFit(this.state.currentItem);
            this.setSelectedSize(this.state.currentItem, nextSize, selectedFit);
            this.renderModalSizes(this.state.currentItem);
            const priceEl = document.getElementById('modal-price');
            if (priceEl) {
                priceEl.textContent = this.formatPrice(this.getProductPrice(this.state.currentItem, nextSize));
            }
        });
        if (sizeChartButton) {
            sizeChartButton.addEventListener('click', () => {
                this.openSizeChartModal();
            });
        }
        if (sizeChartCloseButton) {
            sizeChartCloseButton.addEventListener('click', () => this.closeSizeChartModal());
        }
        if (sizeChartBackdrop) {
            sizeChartBackdrop.addEventListener('click', () => this.closeSizeChartModal());
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.closeProductModal();
            }
            if (event.key === 'Escape' && sizeChartModal && !sizeChartModal.classList.contains('hidden')) {
                this.closeSizeChartModal();
            }
        });
    },

    setupCartModalEvents() {
        const cartModal = document.getElementById('cart-modal');
        if (!cartModal) return;

        const closeButton = document.getElementById('cart-close');
        const backdrop = cartModal.querySelector('[data-close-cart]');
        const clearButton = document.getElementById('cart-clear-btn');
        const checkoutButton = document.getElementById('cart-checkout-btn');
        const itemsList = document.getElementById('cart-items-list');

        if (closeButton) closeButton.addEventListener('click', () => this.closeCartModal());
        if (backdrop) backdrop.addEventListener('click', () => this.closeCartModal());

        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearCart();
            });
        }

        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                this.closeCartModal();
                this.openOrderModal();
            });
        }

        if (itemsList) {
            itemsList.addEventListener('click', (event) => {
                // Плавний автоскрол при відкритті "Частих запитань"
                const detailsTarget = event.target.closest('details.faq-anim');
                if (detailsTarget && !detailsTarget.open) {
                    window.setTimeout(() => {
                        detailsTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 350); // Чекаємо 350мс, поки відпрацює CSS анімація розкриття
                }

                const actionEl = event.target.closest('[data-cart-action]');
                if (!actionEl) return;

                const action = actionEl.getAttribute('data-cart-action');
                const itemKey = decodeURIComponent(actionEl.getAttribute('data-cart-key') || '');
                const entry = this.state.cartItems.find((cartEntry) => this.getCartItemKey(cartEntry.item) === itemKey);
                if (!entry) return;

                if (action === 'increase') {
                    this.setCartItemQuantity(itemKey, entry.quantity + 1);
                    return;
                }

                if (action === 'decrease') {
                    if (entry.quantity <= 1) {
                        this.removeCartItem(itemKey);
                    } else {
                        this.setCartItemQuantity(itemKey, entry.quantity - 1);
                    }
                    return;
                }

                if (action === 'remove') {
                    this.removeCartItem(itemKey);
                }
            });
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !cartModal.classList.contains('hidden')) {
                this.closeCartModal();
            }
        });
    },

    setupOrderModalEvents() {
        const orderModal = document.getElementById('order-modal');
        if (!orderModal) return;

        const closeButton = document.getElementById('order-close');
        const backdrop = orderModal.querySelector('[data-close-order]');
        const form = document.getElementById('order-form');
        const walletButton = document.getElementById('order-wallet-btn');
        const submitButton = document.getElementById('order-submit-btn');
        const invoiceModal = document.getElementById('invoice-modal');
        const invoiceCloseButton = document.getElementById('invoice-close');
        const invoiceBackdrop = invoiceModal?.querySelector('[data-close-invoice]');
        const invoiceConfirmButton = document.getElementById('invoice-confirm-btn');
        const invoiceReceiptInput = document.getElementById('invoice-receipt-input');
        const invoiceReceiptName = document.getElementById('invoice-receipt-name');
        const invoiceTotalAmount = document.getElementById('invoice-total-amount');
        const orderPhoneInput = document.getElementById('order-phone');

        if (closeButton) closeButton.addEventListener('click', () => this.closeOrderModal());
        if (backdrop) backdrop.addEventListener('click', () => this.closeOrderModal());

        if (orderModal) {
            const titleEl = orderModal.querySelector('h3');
            if (titleEl && titleEl.textContent.toUpperCase().includes('ФОРМУВАННЯ ЗАМОВЛЕННЯ')) {
                titleEl.textContent = 'Оформити покупку';
            }

            orderModal.querySelectorAll('p, span').forEach((el) => {
                if (el.textContent.trim().toUpperCase() === 'ФОРМУВАННЯ ЗАМОВЛЕННЯ') {
                    el.style.display = 'none';
                }
            });

            const itemsCountEl = document.getElementById('order-items-count');
            const totalPriceEl = document.getElementById('order-total-price');
            if (itemsCountEl && totalPriceEl && form) {
                let parent = itemsCountEl.parentElement;
                while (parent && parent !== orderModal) {
                    if (parent.contains(totalPriceEl) && !parent.contains(form)) {
                        parent.style.display = 'none';
                        break;
                    }
                    parent = parent.parentElement;
                }
            }
        }

        if (form && !document.getElementById('order-region-tabs')) {
            const activeTabCls = 'flex-1 py-3 text-sm font-extrabold rounded-xl bg-blue-700 text-white transition-colors duration-200';
            const inactiveTabCls = 'flex-1 py-3 text-sm font-bold rounded-xl text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors duration-200';

            const tabsHtml = `
                <div id="order-region-tabs" class="flex gap-2 mb-6">
                    <button type="button" id="tab-ukraine" class="${activeTabCls}">УКРАЇНА</button>
                    <button type="button" id="tab-worldwide" class="${inactiveTabCls}">WORLDWIDE</button>
                </div>
                <div id="worldwide-content" class="hidden text-center py-6">
                    <div class="w-16 h-16 mx-auto bg-slate-800 text-blue-400 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <i class="fa-solid fa-earth-americas text-2xl"></i>
                    </div>
                    <h4 class="text-xl font-bold text-slate-100 mb-2">Worldwide Shipping</h4>
                    <p class="text-sm text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">To order to another country, please contact our Telegram bot or Instagram. Our manager will help you with international shipping details.</p>
                    <div class="flex flex-col gap-3">
                        <a href="https://t.me/Ukrainian_Print_Familybot" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[#0088cc] text-white font-bold rounded-xl hover:bg-[#0077b5] transition-colors duration-200">
                            <i class="fa-brands fa-telegram text-xl"></i>
                            Open Telegram Bot
                        </a>
                        <a href="https://www.instagram.com/ukrainian_print_family" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold rounded-xl hover:opacity-90 transition-opacity duration-200">
                            <i class="fa-brands fa-instagram text-xl"></i>
                            Open Instagram
                        </a>
                    </div>
                </div>
            `;
            form.insertAdjacentHTML('beforebegin', tabsHtml);

            const tabUa = document.getElementById('tab-ukraine');
            const tabWw = document.getElementById('tab-worldwide');
            const wwContent = document.getElementById('worldwide-content');

            const switchTab = (mode) => {
                if (mode === 'ua') {
                    tabUa.className = activeTabCls;
                    tabWw.className = inactiveTabCls;
                    form.style.display = '';
                    wwContent.style.display = 'none';
                } else {
                    tabWw.className = activeTabCls;
                    tabUa.className = inactiveTabCls;
                    form.style.display = 'none';
                    wwContent.style.display = 'block';
                }
            };

            tabUa.addEventListener('click', () => switchTab('ua'));
            tabWw.addEventListener('click', () => switchTab('ww'));
        }

        const extractOrderPhoneDigits = (value) => {
            let digits = String(value || '').replace(/\D/g, '');
            if (digits.startsWith('380')) {
                digits = digits.slice(3);
            } else if (digits.startsWith('38') && digits.length > 9) {
                digits = digits.slice(2);
            }
            if (digits.startsWith('0')) {
                digits = digits.slice(1);
            }
            return digits.slice(0, 9);
        };

        const formatOrderPhoneMask = (digits) => {
            const normalized = String(digits || '');
            const template = '38 (0__) ___-__-__';
            let pointer = 0;
            return template.replace(/_/g, () => {
                if (pointer < normalized.length) {
                    return normalized[pointer++];
                }
                return '_';
            });
        };

        const phoneEditablePositions = [5, 6, 9, 10, 11, 13, 14, 16, 17];
        const getPhoneDigitIndexFromCaret = (caret) => {
            const pos = Number.isFinite(caret) ? caret : 0;
            for (let idx = 0; idx < phoneEditablePositions.length; idx += 1) {
                if (pos <= phoneEditablePositions[idx]) {
                    return idx;
                }
            }
            return phoneEditablePositions.length;
        };
        const getPhoneCaretFromDigitIndex = (digitIndex) => {
            const idx = Math.max(0, Math.min(phoneEditablePositions.length, Number(digitIndex) || 0));
            if (!phoneEditablePositions.length) return 0;
            if (idx >= phoneEditablePositions.length) {
                return phoneEditablePositions[phoneEditablePositions.length - 1] + 1;
            }
            return phoneEditablePositions[idx];
        };
        const setOrderPhoneCaret = (digitIndex) => {
            if (!orderPhoneInput || typeof orderPhoneInput.setSelectionRange !== 'function') return;
            const caret = getPhoneCaretFromDigitIndex(digitIndex);
            orderPhoneInput.setSelectionRange(caret, caret);
        };

        const applyOrderPhoneMask = (forceTemplate = false) => {
            if (!orderPhoneInput) return;
            const digits = extractOrderPhoneDigits(orderPhoneInput.value);
            if (!digits && !forceTemplate && document.activeElement !== orderPhoneInput) {
                orderPhoneInput.value = '';
                return;
            }
            orderPhoneInput.value = formatOrderPhoneMask(digits);
        };

        const syncOrderPhoneValidity = () => {
            if (!orderPhoneInput) return;
            const value = String(orderPhoneInput.value || '').trim();
            if (!value) {
                orderPhoneInput.setCustomValidity('');
                return;
            }
            const digits = extractOrderPhoneDigits(value);
            if (digits.length < 9) {
                orderPhoneInput.setCustomValidity('Введіть повний номер телефону.');
                return;
            }
            orderPhoneInput.setCustomValidity('');
        };

        if (orderPhoneInput) {
            orderPhoneInput.addEventListener('focus', () => {
                applyOrderPhoneMask(true);
                const digits = extractOrderPhoneDigits(orderPhoneInput.value);
                setOrderPhoneCaret(Math.min(digits.length, phoneEditablePositions.length));
                syncOrderPhoneValidity();
            });
            orderPhoneInput.addEventListener('input', () => {
                applyOrderPhoneMask(true);
                const digits = extractOrderPhoneDigits(orderPhoneInput.value);
                setOrderPhoneCaret(Math.min(digits.length, phoneEditablePositions.length));
                syncOrderPhoneValidity();
            });
            orderPhoneInput.addEventListener('blur', () => {
                applyOrderPhoneMask(false);
                syncOrderPhoneValidity();
            });
            orderPhoneInput.addEventListener('paste', () => {
                window.setTimeout(() => {
                    applyOrderPhoneMask(true);
                    const digits = extractOrderPhoneDigits(orderPhoneInput.value);
                    setOrderPhoneCaret(Math.min(digits.length, phoneEditablePositions.length));
                    syncOrderPhoneValidity();
                }, 0);
            });
            orderPhoneInput.addEventListener('keydown', (event) => {
                if (event.key !== 'Backspace' && event.key !== 'Delete') return;

                const currentDigits = extractOrderPhoneDigits(orderPhoneInput.value);
                if (!currentDigits.length) {
                    orderPhoneInput.value = '';
                    syncOrderPhoneValidity();
                    return;
                }

                const start = Number.isFinite(orderPhoneInput.selectionStart) ? orderPhoneInput.selectionStart : 0;
                const end = Number.isFinite(orderPhoneInput.selectionEnd) ? orderPhoneInput.selectionEnd : start;
                const digitsArray = currentDigits.split('');

                event.preventDefault();

                if (start !== end) {
                    const from = getPhoneDigitIndexFromCaret(start);
                    const to = getPhoneDigitIndexFromCaret(end);
                    if (to > from) {
                        digitsArray.splice(from, to - from);
                    }
                    const nextDigits = digitsArray.join('');
                    orderPhoneInput.value = nextDigits ? formatOrderPhoneMask(nextDigits) : '';
                    setOrderPhoneCaret(from);
                    syncOrderPhoneValidity();
                    return;
                }

                const caretIndex = getPhoneDigitIndexFromCaret(start);
                const removeIndex = event.key === 'Backspace' ? caretIndex - 1 : caretIndex;
                if (removeIndex < 0 || removeIndex >= digitsArray.length) {
                    syncOrderPhoneValidity();
                    return;
                }

                digitsArray.splice(removeIndex, 1);
                const nextDigits = digitsArray.join('');
                orderPhoneInput.value = nextDigits ? formatOrderPhoneMask(nextDigits) : '';
                setOrderPhoneCaret(Math.max(0, removeIndex));
                syncOrderPhoneValidity();
            });
        }

        if (form) {
            const submitDefaultText = submitButton?.textContent?.trim() || 'Оплата за реквізитами';
            const walletDefaultText = walletButton?.textContent?.trim() || 'Google Pay / Apple Pay';
            const invoiceConfirmDefaultText = invoiceConfirmButton?.textContent?.trim() || 'Оформити замовлення';
            const MAX_RECEIPT_PDF_BYTES = Math.floor(4.5 * 1024 * 1024);
            const MAX_RECEIPT_IMAGE_INPUT_BYTES = 12 * 1024 * 1024;
            const MAX_RECEIPT_IMAGE_TARGET_BYTES = Math.floor(2.2 * 1024 * 1024);
            const RECEIPT_ATTACH_TARGET_BYTES = Math.floor(0.32 * 1024 * 1024);
            const MAX_RECEIPT_IMAGE_DIMENSION = 2200;
            const MAX_ORDER_REQUEST_BYTES = Math.floor(4.4 * 1024 * 1024);
            const LARGE_ORDER_RECOMMENDATION_TOTAL = 2500;
            let receiptImage = '';
            let receiptFileName = '';
            let isInvoicePending = false;

            const setPaymentButtonsState = (isPending, mode) => {
                if (submitButton) {
                    submitButton.disabled = isPending;
                    submitButton.textContent = isPending && mode === 'invoice'
                        ? 'Зберігаємо...'
                        : submitDefaultText;
                }
                if (walletButton) {
                    walletButton.disabled = isPending;
                    walletButton.textContent = isPending && mode === 'wallet'
                        ? 'Переходимо до LiqPay...'
                        : walletDefaultText;
                }
            };

            const setInvoiceConfirmState = (isPending) => {
                if (!invoiceConfirmButton) return;
                isInvoicePending = Boolean(isPending);
                const isReady = !isInvoicePending && Boolean(receiptImage);
                invoiceConfirmButton.disabled = isInvoicePending || !receiptImage;
                invoiceConfirmButton.classList.toggle('is-ready', isReady);
                invoiceConfirmButton.textContent = isInvoicePending ? 'Оформлюємо...' : invoiceConfirmDefaultText;
            };

            const resetInvoiceReceiptState = () => {
                receiptImage = '';
                receiptFileName = '';
                if (invoiceReceiptInput) {
                    invoiceReceiptInput.value = '';
                }
                if (invoiceReceiptName) {
                    invoiceReceiptName.textContent = 'Файл не вибрано';
                }
                setInvoiceConfirmState(false);
            };

            const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result || ''));
                reader.onerror = () => reject(new Error('Не вдалося прочитати файл.'));
                reader.readAsDataURL(file);
            });

            const getByteLength = (text) => {
                if (typeof text !== 'string') return 0;
                if (typeof TextEncoder !== 'undefined') {
                    return new TextEncoder().encode(text).length;
                }
                try {
                    return unescape(encodeURIComponent(text)).length;
                } catch (_) {
                    return text.length;
                }
            };

            const loadImageFromFile = (file) => new Promise((resolve, reject) => {
                const objectUrl = URL.createObjectURL(file);
                const image = new Image();
                image.onload = () => {
                    URL.revokeObjectURL(objectUrl);
                    resolve(image);
                };
                image.onerror = () => {
                    URL.revokeObjectURL(objectUrl);
                    reject(new Error('Не вдалося обробити зображення.'));
                };
                image.decoding = 'async';
                image.src = objectUrl;
            });

            const canvasToBlob = (canvas, mimeType, quality) => new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Не вдалося стиснути зображення.'));
                        return;
                    }
                    resolve(blob);
                }, mimeType, quality);
            });

            const compressReceiptImage = async (file, targetBytes = MAX_RECEIPT_IMAGE_TARGET_BYTES) => {
                const sourceImage = await loadImageFromFile(file);
                const largestSide = Math.max(sourceImage.width || 0, sourceImage.height || 0);
                const resizeScale = largestSide > MAX_RECEIPT_IMAGE_DIMENSION
                    ? (MAX_RECEIPT_IMAGE_DIMENSION / largestSide)
                    : 1;
                const width = Math.max(1, Math.round((sourceImage.width || 1) * resizeScale));
                const height = Math.max(1, Math.round((sourceImage.height || 1) * resizeScale));

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const context = canvas.getContext('2d', { alpha: false });
                if (!context) {
                    throw new Error('Не вдалося підготувати зображення.');
                }
                context.fillStyle = '#ffffff';
                context.fillRect(0, 0, width, height);
                context.drawImage(sourceImage, 0, 0, width, height);

                const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                let quality = mimeType === 'image/png' ? undefined : 0.92;
                let scale = 1;
                let bestBlob = null;

                for (let attempt = 0; attempt < 8; attempt += 1) {
                    const scaledWidth = Math.max(1, Math.round(width * scale));
                    const scaledHeight = Math.max(1, Math.round(height * scale));
                    let exportCanvas = canvas;

                    if (scaledWidth !== width || scaledHeight !== height) {
                        exportCanvas = document.createElement('canvas');
                        exportCanvas.width = scaledWidth;
                        exportCanvas.height = scaledHeight;
                        const exportCtx = exportCanvas.getContext('2d', { alpha: false });
                        if (!exportCtx) {
                            throw new Error('Не вдалося підготувати зображення.');
                        }
                        exportCtx.fillStyle = '#ffffff';
                        exportCtx.fillRect(0, 0, scaledWidth, scaledHeight);
                        exportCtx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight);
                    }

                    const blob = await canvasToBlob(exportCanvas, mimeType, quality);
                    if (!bestBlob || blob.size < bestBlob.size) {
                        bestBlob = blob;
                    }
                    if (blob.size <= targetBytes) {
                        bestBlob = blob;
                        break;
                    }

                    if (mimeType === 'image/jpeg' && typeof quality === 'number' && quality > 0.58) {
                        quality = Math.max(0.58, quality - 0.12);
                    } else {
                        scale = Math.max(0.6, scale * 0.88);
                    }
                }

                const finalBlob = bestBlob || await canvasToBlob(canvas, mimeType, quality);
                return await readFileAsDataUrl(finalBlob);
            };

            const copyTextToClipboard = async (value) => {
                const text = String(value || '').trim();
                if (!text) return false;
                try {
                    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                        await navigator.clipboard.writeText(text);
                        return true;
                    }
                } catch (_) {}

                try {
                    const helper = document.createElement('textarea');
                    helper.value = text;
                    helper.setAttribute('readonly', 'readonly');
                    helper.style.position = 'fixed';
                    helper.style.opacity = '0';
                    document.body.appendChild(helper);
                    helper.select();
                    const ok = document.execCommand('copy');
                    helper.remove();
                    return Boolean(ok);
                } catch (_) {
                    return false;
                }
            };

            const openInvoiceModal = () => {
                if (!invoiceModal) return;
                window.UI?.openModal('invoice-modal');
            };

            const closeInvoiceModal = () => {
                if (!invoiceModal) return;
                window.UI?.closeModal('invoice-modal');
            };

            const formatInvoiceAmount = (value) => {
                const amount = Number(value || 0);
                if (!Number.isFinite(amount) || amount <= 0) return '0₴';
                return `${Math.round(amount)}₴`;
            };

            const buildOrderPayload = () => {
                const fullNameInput = document.getElementById('order-full-name');
                const cityInput = document.getElementById('order-city');
                const telegramInput = document.getElementById('order-shipping');
                const phoneInput = document.getElementById('order-phone');
                const commentInput = document.getElementById('order-comment');
                const name = fullNameInput?.value?.trim() || 'Без ПІБ';
                const city = cityInput?.value?.trim() || 'Без міста та відділення';
                const telegram = telegramInput?.value?.trim() || '';
                const shipping = '';
                const phoneDigits = extractOrderPhoneDigits(phoneInput?.value || '');
                const phone = phoneDigits.length === 9
                    ? formatOrderPhoneMask(phoneDigits)
                    : (phoneInput?.value?.trim() || 'Без телефону');
                const comment = commentInput?.value?.trim() || '';
                const cartItems = [...this.state.cartItems];

                if (!cartItems.length) {
                    window.UI?.showToast?.('Кошик порожній. Додайте товари перед оформленням.', { tone: 'warning' });
                    this.closeOrderModal();
                    return null;
                }

                return {
                    name,
                    city,
                    shipping,
                    telegram,
                    phone,
                    comment,
                    items: cartItems.map((entry) => ({
                        title: entry.item?.title || '',
                        category: this.getDisplayCategory(entry.item),
                        source: entry.item?.source || '',
                        color: entry.item?.color || '',
                        size: entry.item?.selectedSize ? `${entry.item.selectedSize}${entry.item.selectedFit === 'oversize' ? ' (oversize)' : ''}` : '',
                        price: this.getProductPrice(entry.item),
                        quantity: this.normalizeQuantity(entry.quantity),
                        image: entry.item?.image || '',
                        customKey: entry.item?.customKey || '',
                        sourceImages: Array.isArray(entry.item?.sourceImages) ? entry.item.sourceImages : []
                    })),
                    total: this.getCartTotal()
                };
            };

            const processInvoiceOrder = async () => {
                syncOrderPhoneValidity();
                if (!form.reportValidity()) return;
                const orderPayload = buildOrderPayload();
                if (!orderPayload) return;
                if (!receiptImage) {
                    window.UI?.showToast?.('Додайте скріншот або квитанцію про оплату перед оформленням замовлення.', { tone: 'warning' });
                    return;
                }

                setPaymentButtonsState(true, 'invoice');
                setInvoiceConfirmState(true);
                try {
                    const requestPayload = {
                        ...orderPayload,
                        paymentMethod: 'invoice',
                        receiptImage,
                        receiptName: receiptFileName
                    };
                    const requestBody = JSON.stringify(requestPayload);
                    if (getByteLength(requestBody) > MAX_ORDER_REQUEST_BYTES) {
                        if (
                            requestPayload.receiptImage
                            && String(requestPayload.receiptImage).startsWith('data:image/')
                            && requestPayload.receiptImage === receiptImage
                        ) {
                            try {
                                const responseBlob = await fetch(receiptImage).then((r) => r.blob());
                                const fallbackName = receiptFileName || 'receipt-image.jpg';
                                const fallbackType = responseBlob.type || 'image/jpeg';
                                const sourceForCompression = new File([responseBlob], fallbackName, { type: fallbackType });
                                receiptImage = await compressReceiptImage(sourceForCompression, MAX_RECEIPT_IMAGE_TARGET_BYTES);
                                requestPayload.receiptImage = receiptImage;
                            } catch (_) {}
                        }

                        const retryBody = JSON.stringify(requestPayload);
                        if (getByteLength(retryBody) > MAX_ORDER_REQUEST_BYTES) {
                            throw new Error('Файл квитанції завеликий для безпечного відправлення. Для PDF бажано до 3.2 МБ, для фото стиснення виконується автоматично.');
                        }

                        const response = await fetch('/api/orders/create', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: retryBody
                        });

                        const result = await response.json().catch(() => ({}));
                        if (!response.ok) {
                            if (response.status === 413) {
                                throw new Error('Розмір замовлення перевищує ліміт сервера. Зменште вагу квитанції або кількість/розмір макетів у кошику.');
                            }
                            throw new Error(result?.error || 'Не вдалося оформити замовлення за реквізитами.');
                        }

                        window.UI?.showOrderSuccessModal?.();
                        this.clearCart(false);
                        closeInvoiceModal();
                        this.closeOrderModal();
                        form.reset();
                        resetInvoiceReceiptState();
                        return;
                    }

                    const response = await fetch('/api/orders/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: requestBody
                    });

                    const result = await response.json().catch(() => ({}));
                    if (!response.ok) {
                        throw new Error(result?.error || 'Не вдалося оформити замовлення за реквізитами.');
                    }

                    window.UI?.showOrderSuccessModal?.();
                    this.clearCart(false);
                    closeInvoiceModal();
                    this.closeOrderModal();
                    form.reset();
                    resetInvoiceReceiptState();
                } catch (error) {
                    console.warn('Invoice order submission failed.', error);
                    window.UI?.showToast?.(error?.message || 'Не вдалося оформити замовлення. Спробуйте ще раз.', { tone: 'warning' });
                } finally {
                    setPaymentButtonsState(false);
                    setInvoiceConfirmState(false);
                }
            };

            const processWalletPayment = async () => {
                syncOrderPhoneValidity();
                if (!form.reportValidity()) return;
                const orderPayload = buildOrderPayload();
                if (!orderPayload) return;

                setPaymentButtonsState(true, 'wallet');
                try {
                    const response = await fetch('/api/liqpay/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...orderPayload,
                            paymentMethod: 'wallet'
                        })
                    });

                    const result = await response.json().catch(() => ({}));
                    if (!response.ok) {
                        throw new Error(result?.error || 'Не вдалося ініціювати оплату через LiqPay.');
                    }

                    if (!result?.checkoutUrl) {
                        throw new Error('LiqPay checkout URL is missing.');
                    }

                    window.sessionStorage.setItem(this.LIQPAY_PENDING_ORDER_STORAGE_KEY, JSON.stringify({
                        orderId: result.orderId,
                        total: orderPayload.total,
                        createdAt: Date.now()
                    }));

                    window.location.assign(result.checkoutUrl);
                } catch (error) {
                    console.warn('LiqPay checkout init failed.', error);
                    window.UI?.showToast?.(error?.message || 'Не вдалося перейти до LiqPay. Спробуйте ще раз.', { tone: 'warning' });
                    setPaymentButtonsState(false);
                }
            };

            form.addEventListener('submit', (event) => {
                event.preventDefault();
                if (submitButton) {
                    submitButton.click();
                }
            });

            if (submitButton) {
                submitButton.addEventListener('click', () => {
                    syncOrderPhoneValidity();
                    if (!form.reportValidity()) return;
                    const orderPayload = buildOrderPayload();
                    if (!orderPayload) return;
                    if (invoiceTotalAmount) {
                        invoiceTotalAmount.textContent = `💰 Сума до сплати: ${formatInvoiceAmount(orderPayload.total)}`;
                    }
                    if (Number(orderPayload.total || 0) > LARGE_ORDER_RECOMMENDATION_TOTAL) {
                        window.UI?.showToast?.(
                            'При великих замовленнях рекомендується оплачувати через LiqPay для швидшого та надійнішого підтвердження оплати.',
                            { tone: 'warning', duration: 10000 }
                        );
                    }
                    resetInvoiceReceiptState();
                    this.closeOrderModal();
                    openInvoiceModal();
                });
            }

            if (walletButton) {
                walletButton.addEventListener('click', async () => {
                    await processWalletPayment();
                });
            }

            if (invoiceReceiptInput) {
                invoiceReceiptInput.addEventListener('change', async () => {
                    const selectedFile = invoiceReceiptInput.files?.[0];
                    if (!selectedFile) {
                        resetInvoiceReceiptState();
                        return;
                    }

                    const fileType = String(selectedFile.type || '').toLowerCase();
                    const fileName = String(selectedFile.name || '').trim();
                    const normalizedName = fileName.toLowerCase();
                    const isPdfByName = normalizedName.endsWith('.pdf');
                    const isImageByName = /\.(png|jpe?g|webp|gif|bmp|heic|heif|avif)$/i.test(normalizedName);
                    const isPdf = fileType === 'application/pdf' || isPdfByName;
                    const isImage = fileType.startsWith('image/')
                        || ((fileType === 'application/octet-stream' || !fileType) && isImageByName);

                    if (!isImage && !isPdf) {
                        window.UI?.showToast?.('Дозволено завантажувати тільки зображення або PDF (скріншот/квитанцію).', { tone: 'warning' });
                        resetInvoiceReceiptState();
                        return;
                    }

                    if (isPdf && selectedFile.size > MAX_RECEIPT_PDF_BYTES) {
                        window.UI?.showToast?.('PDF файл завеликий. Максимум 4.5 МБ.', { tone: 'warning' });
                        resetInvoiceReceiptState();
                        return;
                    }

                    if (isImage && selectedFile.size > MAX_RECEIPT_IMAGE_INPUT_BYTES) {
                        window.UI?.showToast?.('Файл занадто великий. Максимум 12 МБ.', { tone: 'warning' });
                        resetInvoiceReceiptState();
                        return;
                    }

                    try {
                        let normalizedDataUrl = '';
                        if (isImage) {
                            // Normalize image receipt immediately on attach so original file size
                            // does not impact later order submission payload limits.
                            normalizedDataUrl = await compressReceiptImage(selectedFile, RECEIPT_ATTACH_TARGET_BYTES);
                        } else {
                            normalizedDataUrl = await readFileAsDataUrl(selectedFile);
                        }

                        if (normalizedDataUrl.startsWith('data:application/octet-stream;base64,')) {
                            if (isPdf) {
                                normalizedDataUrl = normalizedDataUrl.replace('data:application/octet-stream;base64,', 'data:application/pdf;base64,');
                            } else if (isImage) {
                                const mimeByExt = normalizedName.endsWith('.png') ? 'image/png'
                                    : normalizedName.endsWith('.webp') ? 'image/webp'
                                    : normalizedName.endsWith('.gif') ? 'image/gif'
                                    : 'image/jpeg';
                                normalizedDataUrl = normalizedDataUrl.replace('data:application/octet-stream;base64,', `data:${mimeByExt};base64,`);
                            }
                        }

                        if (!normalizedDataUrl.startsWith('data:image/') && !normalizedDataUrl.startsWith('data:application/pdf')) {
                            throw new Error('Непідтримуваний формат файлу.');
                        }
                        receiptImage = normalizedDataUrl;
                        receiptFileName = fileName || 'receipt-file';
                        if (invoiceReceiptName) {
                            invoiceReceiptName.textContent = fileName || 'Файл обрано';
                        }
                        setInvoiceConfirmState(false);
                    } catch (error) {
                        console.warn('Failed to prepare invoice receipt image.', error);
                        window.UI?.showToast?.('Не вдалося обробити файл. Спробуйте інше зображення.', { tone: 'warning' });
                        resetInvoiceReceiptState();
                    }
                });
            }

            document.querySelectorAll('[data-copy-invoice]').forEach((button) => {
                if (button.dataset.copyReady === '1') return;
                button.dataset.copyReady = '1';
                button.addEventListener('click', async () => {
                    const value = button.getAttribute('data-copy-invoice') || '';
                    const ok = await copyTextToClipboard(value);
                    if (ok) {
                        const initial = button.textContent;
                        button.textContent = 'Скопійовано';
                        window.setTimeout(() => {
                            button.textContent = initial || 'Copy';
                        }, 1200);
                    } else {
                        window.UI?.showToast?.('Не вдалося скопіювати. Скопіюйте реквізити вручну.', { tone: 'warning' });
                    }
                });
            });

            if (invoiceConfirmButton) {
                invoiceConfirmButton.addEventListener('click', async () => {
                    await processInvoiceOrder();
                });
            }

            const closeInvoiceAndBack = () => {
                closeInvoiceModal();
                this.openOrderModal();
            };

            if (invoiceCloseButton) {
                invoiceCloseButton.addEventListener('click', () => {
                    closeInvoiceAndBack();
                });
            }

            if (invoiceBackdrop) {
                invoiceBackdrop.addEventListener('click', () => {
                    closeInvoiceAndBack();
                });
            }

            setInvoiceConfirmState(false);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && invoiceModal && !invoiceModal.classList.contains('hidden')) {
                window.UI?.closeModal('invoice-modal');
                this.openOrderModal();
                return;
            }
            if (event.key === 'Escape' && !orderModal.classList.contains('hidden')) {
                this.closeOrderModal();
            }
        });
    },

    init() {
        this.loadCartFromStorage();
        this.loadFavoritesFromStorage();
        this.renderCartModal();
        this.setupModalEvents();
        this.setupCartModalEvents();
        this.setupOrderModalEvents();
        this.setupSearchInput();

        try {
            const rawState = window.sessionStorage.getItem('upf_catalog_state');
            if (rawState) {
                const parsed = JSON.parse(rawState);
                if (parsed) {
                    if (parsed.activeCategory) this.state.activeCategory = parsed.activeCategory;
                    if (parsed.page) {
                        this.state.page = parsed.page;
                        this.state.restoredPage = parsed.page;
                    }
                    if (parsed.searchQuery !== undefined) this.state.searchQuery = parsed.searchQuery;
                }
            }
        } catch (_) {}

        const demoCategories = this.DEFAULT_CATEGORIES.slice();
        const demoProducts = this.generateDemoProducts(demoCategories);
        this.setCatalogData(demoCategories, demoProducts);
        void this.checkPendingLiqPayOrderReturn();

        const shouldOpenCart = window.sessionStorage.getItem('openCartOnHome') === '1';
        let cartOpened = false;

        const openCartIfNeeded = () => {
            if (!shouldOpenCart || cartOpened) return;
            window.sessionStorage.removeItem('openCartOnHome');
            this.openCartModal();
            cartOpened = true;
        };

        const hadPending = Boolean(this.getPendingProductOrder());
        const addedImmediately = this.applyPendingProductOrder();
        if (!hadPending || addedImmediately) {
            openCartIfNeeded();
        }

        const finalizePendingFlow = () => {
            const addedAfterLoad = this.applyPendingProductOrder();
            if (addedAfterLoad || !this.getPendingProductOrder()) {
                openCartIfNeeded();
                return;
            }
            openCartIfNeeded();
        };

        const loadPromise = this.loadProductsFromApi();
        if (loadPromise && typeof loadPromise.finally === 'function') {
            loadPromise.finally(() => {
                finalizePendingFlow();
                if (this.state.restoredPage) {
                    this.state.restoredPage = null;
                    this.saveCatalogState();
                }
            });
        } else {
            finalizePendingFlow();
            if (this.state.restoredPage) {
                this.state.restoredPage = null;
                this.saveCatalogState();
            }
        }
    }
};

window.Catalog = Catalog;




