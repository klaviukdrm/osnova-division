const Catalog = {
    CART_STORAGE_KEY: 'upf_cart_v1',
    FAVORITES_STORAGE_KEY: 'upf_favorites_v1',
    ITEMS_PER_PAGE: 40,
    DEFAULT_CATEGORIES: [
        'Футболка з надруком',
        '\u0425\u0443\u0434\u0456',
        '\u0427\u0430\u0448\u043a\u0438',
        '\u0422\u0435\u0440\u043c\u043e\u0447\u0430\u0448\u043a\u0438',
        '\u041f\u043e\u0434\u0430\u0440\u0443\u043d\u043a\u043e\u0432\u0456 \u043d\u0430\u0431\u043e\u0440\u0438',
        '\u0421\u0443\u043c\u043a\u0438-\u0448\u043e\u043f\u0435\u0440\u0438'
    ],
    DEMO_ADJECTIVES: ['Стильний', 'Преміум', 'Лімітований', 'Сезонний', 'Міський', 'Soft Touch'],
    DEMO_SERIES: ['серія', 'набір', 'дроп', 'варіант'],
    BASE_APPAREL_PRICE: 650,
    HIGH_APPAREL_PRICE: 750,
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
        page: 1,
        currentItem: null,
        currentModalSize: '',
        imageIndexes: {},
        selectedSizes: {},
        cartItems: [],
        favoriteKeys: new Set()
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

    getDesignNameFromFile(fileName) {
        const raw = String(fileName || '').trim();
        const decoded = raw.includes('%') ? decodeURIComponent(raw) : raw;
        return decoded
            .replace(/\.[^.]+$/, '')
            .replace(/\s+/g, ' ')
            .trim();
    },

    normalizeApparelCategoryLabel(label) {
        const value = String(label || '').trim();
        if (!value) return 'Каталог';

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
            const image = this.toCatalogImagePath(fileName);
            const previewImage = this.toCatalogThumbPath(fileName);
            const designKey = designName.toLocaleUpperCase('uk-UA');
            const isHighPrice = this.HIGH_PRICE_APPAREL_DESIGNS.has(designKey);
            const price = isHighPrice ? this.HIGH_APPAREL_PRICE : this.BASE_APPAREL_PRICE;
            const normalizedCategory = this.normalizeApparelCategoryLabel(category);
            const displayCategory = isHighPrice ? this.DOUBLE_SIDED_APPAREL_LABEL : normalizedCategory;

            return {
                title: `\u0424\u0443\u0442\u0431\u043e\u043b\u043a\u0430 \u0437 \u043f\u0440\u0438\u043d\u0442\u043e\u043c \u00ab${designName}\u00bb`,
                price,
                image,
                previewImage,
                category: normalizedCategory,
                displayCategory,
                description: `\u0413\u043e\u0442\u043e\u0432\u0430 \u0444\u0443\u0442\u0431\u043e\u043b\u043a\u0430 \u0437 \u043d\u0430\u0434\u0440\u0443\u043a\u043e\u043c \u00ab${designName}\u00bb.`,
                gallery: [image],
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

        categories.forEach((category) => {
            const hasRealApparelProducts = category === apparelCategory && apparelProducts.length > 0;
            const count = hasRealApparelProducts ? 0 : 4;

            for (let index = 0; index < count; index += 1) {
                const title = `${category} — ${this.DEMO_ADJECTIVES[index % this.DEMO_ADJECTIVES.length]} ${this.DEMO_SERIES[index % this.DEMO_SERIES.length]} ${index + 1}`;
                const image = this.getDemoVisual(category, index);
                items.push({
                    title,
                    price: this.getDemoPrice(category, index),
                    image,
                    category,
                    description: this.getDemoDescription(category, title),
                    gallery: [image]
                });
            }
        });
        return items;
    },

    formatPrice(value) {
        if (value === null || value === undefined || value === '') {
            return 'ціна уточнюється';
        }

        const num = Number(value);
        return Number.isFinite(num) ? `${num.toLocaleString('uk-UA')} грн` : `${value} грн`;
    },

    normalizeQuantity(value) {
        const qty = Number(value);
        return Number.isFinite(qty) ? Math.max(1, Math.floor(qty)) : 1;
    },

    getProductPrice(item) {
        const price = Number(item?.price);
        return Number.isFinite(price) ? price : 0;
    },

    getCartItemKey(item) {
        if (item?.customKey) {
            return `custom::${item.customKey}`;
        }
        const sizeKey = item?.selectedSize ? `::size:${item.selectedSize}` : '';
        return `${item?.category || ''}::${item?.title || ''}${sizeKey}`;
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

    clearCart() {
        this.state.cartItems = [];
        this.saveCartToStorage();
        this.renderCartModal();
        this.updateCartBadge();
        window.UI?.showToast?.('Кошик очищено', { tone: 'info' });
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

            return `
                <article class="rounded-3xl border border-slate-200 p-4 md:p-5">
                    <div class="flex gap-4 items-start">
                        <div class="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                            <img src="${image}" alt="${item.title || 'Товар'}" class="w-full h-full object-contain">
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">${this.getDisplayCategory(item)}</p>
                            <h4 class="text-lg font-semibold text-slate-900 leading-tight mt-1">${item.title || 'Товар'}</h4>
                            ${item.selectedSize ? `<p class="text-xs text-slate-500 mt-1">Розмір: ${item.selectedSize}</p>` : ''}
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
        }).join('');
    },

    setCatalogData(categories, products) {
        const nextCategories = (categories || []).filter(Boolean);
        const nextProducts = (products || []).filter(Boolean);
        this.state.categories = nextCategories;
        this.state.products = nextProducts;

        if (!this.state.activeCategory || !nextCategories.includes(this.state.activeCategory)) {
            this.state.activeCategory = nextCategories[0] || null;
        }
        this.state.page = 1;

        this.renderCategories();
        this.renderProducts();
    },

    getFilteredProducts() {
        if (!this.state.activeCategory) return this.state.products;
        return this.state.products.filter((item) => item.category === this.state.activeCategory);
    },

    getCardKey(item) {
        return `${item?.category || ''}::${item?.title || ''}`;
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

    getSelectedSize(item, availableSizes = []) {
        const sizes = Array.isArray(availableSizes) ? availableSizes.filter(Boolean) : [];
        if (!sizes.length) return '';

        const key = this.getCardKey(item);
        const current = this.state.selectedSizes[key];
        if (current && sizes.includes(current)) {
            return current;
        }

        const fallback = sizes[0];
        this.state.selectedSizes[key] = fallback;
        return fallback;
    },

    setSelectedSize(item, size) {
        if (!item || !size) return;
        const key = this.getCardKey(item);
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
            sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
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

    getAvailableSizes(item) {
        const sizes = this.getCardMeta(item, 0).sizes || [];
        const normalized = sizes.filter((size) => typeof size === 'string' && size.trim());
        if (normalized.length === 1 && normalized[0].toUpperCase() === 'ONE SIZE') {
            return [];
        }
        return normalized;
    },

    renderModalSizes(item) {
        const selectorWrap = document.getElementById('modal-size-selector');
        const optionsWrap = document.getElementById('modal-size-options');
        if (!selectorWrap || !optionsWrap) return;

        const sizes = this.getAvailableSizes(item);
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
                : this.getSelectedSize(item, sizes);
        }
        this.state.currentModalSize = selected;

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

        container.innerHTML = items.map((name) => {
            const isActive = name === this.state.activeCategory;
            const classes = isActive
                ? 'bg-blue-700 text-white border-blue-700 shadow'
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-700';
            return `
                <button type="button" class="category-chip px-4 py-2 rounded-2xl border text-sm font-medium transition cursor-pointer ${classes}" data-category="${encodeURIComponent(name)}" aria-pressed="${isActive}">
                    ${this.getCategoryChipLabel(name)}
                </button>
            `;
        }).join('');

        container.querySelectorAll('[data-category]').forEach((button) => {
            button.addEventListener('click', () => {
                this.state.activeCategory = decodeURIComponent(button.getAttribute('data-category'));
                this.state.page = 1;
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
                    this.renderProducts();
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
            grid.innerHTML = '';
            this.renderPagination(0);
            return;
        }

        const totalPages = Math.max(1, Math.ceil(filteredList.length / this.ITEMS_PER_PAGE));
        if (!Number.isFinite(this.state.page) || this.state.page < 1) {
            this.state.page = 1;
        }
        if (this.state.page > totalPages) {
            this.state.page = totalPages;
        }

        const startIndex = (this.state.page - 1) * this.ITEMS_PER_PAGE;
        const list = filteredList.slice(startIndex, startIndex + this.ITEMS_PER_PAGE);

        empty.classList.add('hidden');
        grid.innerHTML = list.map((item, index) => `
            ${(() => {
                const previewGallery = this.buildPreviewGalleryUrls(item);
                const galleryLength = previewGallery.length || 1;
                const imageIndex = this.getCardImageIndex(item, galleryLength);
                const activeImage = previewGallery[imageIndex] || this.getPrimaryPreviewImage(item);
                const meta = this.getCardMeta(item, startIndex + index);
                const selectedSize = this.getSelectedSize(item, meta.sizes);
                return `
            <article class="product-card product-card-v2 bg-white rounded-3xl overflow-hidden border border-slate-200 text-left transition" data-index="${index}">
                <div class="product-card-v2__media" data-action="open-modal" data-index="${index}">
                    <img src="${activeImage}" alt="${item.title || 'Товар'}" class="w-full h-full object-cover" loading="lazy" decoding="async">

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

                <div class="p-6 space-y-3">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">${this.getDisplayCategory(item)}</p>
                    <p class="font-semibold text-lg leading-snug text-slate-900">${item.title || 'Товар'}</p>

                    <div class="product-card-v2__price-row">
                        <span class="product-card-v2__price">${this.formatPrice(item.price)}</span>
                    </div>

                    <div class="product-card-v2__meta-group">
                        <div>
                            <p class="product-card-v2__meta-label">Розміри</p>
                            <div class="product-card-v2__sizes">
                                ${meta.sizes.map((size) => `
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

                <div class="px-6 pb-6 pt-1">
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

            if (action === 'open-modal') {
                this.openProductModal(item);
                return;
            }

            if (action === 'order-product') {
                const selectedSize = this.getSelectedSize(item, this.getCardMeta(item, startIndex + index).sizes);
                this.addToCart({
                    ...item,
                    selectedSize
                }, 1);
                return;
            }

            if (action === 'select-size') {
                const selectedSize = decodeURIComponent(actionElement.getAttribute('data-size') || '');
                if (!selectedSize) return;
                this.setSelectedSize(item, selectedSize);
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

    getPrimaryImage(item) {
        if (item.image) return item.image;
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

    openProductModal(item) {
        const modal = document.getElementById('product-modal');
        if (!modal) return;

        this.state.currentItem = item;
        this.state.currentModalSize = item?.selectedSize || '';
        const gallery = this.buildPreviewGalleryUrls(item);
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
        if (categoryEl) categoryEl.textContent = category;
        if (priceEl) priceEl.textContent = this.formatPrice(item.price);
        if (descriptionEl) descriptionEl.textContent = description;
        if (detailCategoryEl) detailCategoryEl.textContent = category;
        if (detailNoteEl) detailNoteEl.textContent = 'Оформлення цього товару без переходу в редактор.';
        if (mainImageEl) {
            mainImageEl.src = gallery[0] || '';
            mainImageEl.alt = title;
        }

        if (thumbsEl) {
            if (gallery.length <= 1) {
                thumbsEl.innerHTML = '';
                thumbsEl.classList.add('hidden');
            } else {
                thumbsEl.classList.remove('hidden');
                thumbsEl.innerHTML = gallery.map((url, index) => `
                    <button type="button" class="rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-700 transition ${index === 0 ? 'border-blue-700' : ''}" data-thumb="${url}">
                        <img src="${url}" alt="${title} ${index + 1}" class="w-full h-20 object-contain bg-slate-50">
                    </button>
                `).join('');

                thumbsEl.querySelectorAll('[data-thumb]').forEach((button) => {
                    button.addEventListener('click', () => {
                        const url = button.getAttribute('data-thumb');
                        if (mainImageEl && url) mainImageEl.src = url;
                        thumbsEl.querySelectorAll('[data-thumb]').forEach((itemButton) => itemButton.classList.remove('border-blue-700'));
                        button.classList.add('border-blue-700');
                    });
                });
            }
        }

        this.renderModalSizes(item);

        window.UI?.openModal('product-modal');
    },

    closeProductModal() {
        window.UI?.closeModal('product-modal');
    },

    openSizeChartModal() {
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
            alert('Додайте хоча б один товар у кошик.');
            return;
        }

        const itemsCountEl = document.getElementById('order-items-count');
        const totalPriceEl = document.getElementById('order-total-price');
        const fullNameInput = document.getElementById('order-full-name');
        const shippingInput = document.getElementById('order-shipping');
        const phoneInput = document.getElementById('order-phone');
        const commentInput = document.getElementById('order-comment');
        const orderHint = document.getElementById('order-note-hint');
        if (itemsCountEl) itemsCountEl.textContent = String(this.getCartItemsCount());
        if (totalPriceEl) totalPriceEl.textContent = this.formatPrice(this.getCartTotal());
        if (fullNameInput && !fullNameInput.value) fullNameInput.value = '';
        if (phoneInput && !phoneInput.value) phoneInput.value = '';
        if (shippingInput && !shippingInput.value) shippingInput.value = '';
        if (commentInput && !commentInput.value) commentInput.value = '';
        if (orderHint) {
            orderHint.textContent = '\u041f\u0456\u0441\u043b\u044f \u043f\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0436\u0435\u043d\u043d\u044f \u043c\u0438 \u0437\u0432\u2019\u044f\u0436\u0435\u043c\u043e\u0441\u044f \u0437 \u0432\u0430\u043c\u0438 \u0434\u043b\u044f \u0443\u0442\u043e\u0447\u043d\u0435\u043d\u043d\u044f \u0434\u0435\u0442\u0430\u043b\u0435\u0439 \u0437\u0430\u043c\u043e\u0432\u043b\u0435\u043d\u043d\u044f.';
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
                const sizes = this.getAvailableSizes(itemToCart);
                const selectedSize = this.state.currentModalSize || (sizes.length ? this.getSelectedSize(itemToCart, sizes) : '');
                if (selectedSize) {
                    itemToCart.selectedSize = selectedSize;
                    this.setSelectedSize(itemToCart, selectedSize);
                }
                this.addToCart(itemToCart, 1);
                this.closeProductModal();
            });
        }
        modal.addEventListener('click', (event) => {
            const sizeButton = event.target.closest('[data-modal-size]');
            if (!sizeButton || !this.state.currentItem) return;
            const nextSize = decodeURIComponent(sizeButton.getAttribute('data-modal-size') || '');
            if (!nextSize) return;
            this.state.currentModalSize = nextSize;
            this.setSelectedSize(this.state.currentItem, nextSize);
            this.renderModalSizes(this.state.currentItem);
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

        if (closeButton) closeButton.addEventListener('click', () => this.closeOrderModal());
        if (backdrop) backdrop.addEventListener('click', () => this.closeOrderModal());

        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                const fullNameInput = document.getElementById('order-full-name');
                const shippingInput = document.getElementById('order-shipping');
                const phoneInput = document.getElementById('order-phone');
                const commentInput = document.getElementById('order-comment');
                const submitButton = document.getElementById('order-submit-btn');
                const name = fullNameInput?.value?.trim() || 'Без ПІБ';
                const shipping = shippingInput?.value?.trim() || 'Без номера доставки';
                const phone = phoneInput?.value?.trim() || 'Без телефону';
                const comment = commentInput?.value?.trim() || '';
                const cartItems = [...this.state.cartItems];

                if (!cartItems.length) {
                    alert('Кошик порожній. Додайте товари перед оформленням.');
                    this.closeOrderModal();
                    return;
                }

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = 'Зберігаємо...';
                }

                try {
                    const orderPayload = {
                        name,
                        shipping,
                        phone,
                        comment,
                        items: cartItems.map((entry) => ({
                            title: entry.item?.title || '',
                            category: entry.item?.category || '',
                            price: this.getProductPrice(entry.item),
                            quantity: this.normalizeQuantity(entry.quantity)
                        })),
                        total: this.getCartTotal()
                    };
                    console.info('Order captured locally', orderPayload);

                    alert(`Замовлення оформлено.\nПІБ: ${name}\nТелефон: ${phone}\nДоставка: ${shipping}\nПозицій: ${this.getCartItemsCount()}`);
                    this.clearCart();
                    this.closeOrderModal();
                    form.reset();
                } catch (error) {
                    console.warn('Order submission failed.', error);
                    alert('\u041d\u0435 \u0432\u0434\u0430\u043b\u043e\u0441\u044f \u043e\u0444\u043e\u0440\u043c\u0438\u0442\u0438 \u0437\u0430\u043c\u043e\u0432\u043b\u0435\u043d\u043d\u044f. \u0421\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437.');
                } finally {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Підтвердити замовлення';
                    }
                }
            });
        }

        document.addEventListener('keydown', (event) => {
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
        const demoCategories = this.DEFAULT_CATEGORIES.slice();
        const demoProducts = this.generateDemoProducts(demoCategories);
        this.setCatalogData(demoCategories, demoProducts);

        if (window.sessionStorage.getItem('openCartOnHome') === '1') {
            window.sessionStorage.removeItem('openCartOnHome');
            this.openCartModal();
        }
    }
};

window.Catalog = Catalog;




