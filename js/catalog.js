const Catalog = {
    CMS_URL: window.CMS_URL || 'http://localhost:8055',
    DEFAULT_CATEGORIES: [
        'Одяг з надруком',
        'Худі',
        'Чашки',
        'Термочашки',
        'Подарункові набори',
        'Сумки-шопери'
    ],
    DEMO_ADJECTIVES: ['Стильний', 'Преміум', 'Лімітований', 'Сезонний', 'Міський', 'Soft Touch'],
    DEMO_SERIES: ['серія', 'набір', 'дроп', 'варіант'],
    state: {
        categories: [],
        products: [],
        activeCategory: null,
        currentItem: null,
        imageIndexes: {}
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
            return `Готова металева чашка ${title.toLowerCase()} з друком під wrap або лого.`;
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

    generateDemoProducts(categories) {
        const items = [];
        categories.forEach((category) => {
            for (let index = 0; index < 4; index += 1) {
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

    setCatalogData(categories, products) {
        const nextCategories = (categories || []).filter(Boolean);
        const nextProducts = (products || []).filter(Boolean);
        this.state.categories = nextCategories;
        this.state.products = nextProducts;

        if (!this.state.activeCategory || !nextCategories.includes(this.state.activeCategory)) {
            this.state.activeCategory = nextCategories[0] || null;
        }

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
            sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        } else if (source.includes('термо')) {
            colors = ['#111827', '#334155', '#0f766e', '#a16207'];
            sizes = ['350 мл', '450 мл', '500 мл'];
        } else if (source.includes('чаш')) {
            colors = ['#d1d5db', '#64748b', '#0f172a', '#334155'];
            sizes = ['300 мл', '400 мл', '500 мл'];
        } else {
            colors = ['#f8fafc', '#111827', '#1d4ed8', '#991b1b'];
            sizes = ['S', 'M', 'L', 'XL'];
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
                    ${name}
                </button>
            `;
        }).join('');

        container.querySelectorAll('[data-category]').forEach((button) => {
            button.addEventListener('click', () => {
                this.state.activeCategory = decodeURIComponent(button.getAttribute('data-category'));
                this.renderCategories();
                this.renderProducts();
            });
        });
    },

    renderProducts() {
        const grid = document.getElementById('catalog-grid');
        const empty = document.getElementById('catalog-empty');
        if (!grid || !empty) return;

        const list = this.getFilteredProducts();
        if (!list.length) {
            empty.classList.remove('hidden');
            grid.innerHTML = '';
            return;
        }

        empty.classList.add('hidden');
        grid.innerHTML = list.map((item, index) => `
            ${(() => {
                const gallery = this.buildGalleryUrls(item);
                const galleryLength = gallery.length || 1;
                const imageIndex = this.getCardImageIndex(item, galleryLength);
                const activeImage = gallery[imageIndex] || this.getPrimaryImage(item);
                const meta = this.getCardMeta(item, index);
                const isFavorite = window.SiteAuth?.isFavoriteProduct?.(item);
                const originalPrice = Math.round(Number(item.price || 0) * (100 / (100 - meta.discount)));
                return `
            <article class="product-card product-card-v2 bg-white rounded-3xl overflow-hidden border border-slate-200 text-left transition" data-index="${index}">
                <div class="product-card-v2__media" data-action="open-modal" data-index="${index}">
                    <img src="${activeImage}" alt="${item.title || 'Товар'}" class="w-full h-full object-contain">

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
                        ${gallery.map((_, dotIndex) => `
                            <button type="button" class="product-card-v2__dot ${dotIndex === imageIndex ? 'is-active' : ''}" data-action="set-image" data-index="${index}" data-image-index="${dotIndex}" data-gallery-length="${galleryLength}" aria-label="Фото ${dotIndex + 1}"></button>
                        `).join('')}
                    </div>
                    ` : ''}

                    <button type="button" class="product-card-v2__favorite ${isFavorite ? 'is-active' : ''}" data-action="toggle-favorite" data-index="${index}" aria-label="${isFavorite ? 'Прибрати з обраного' : 'Додати до обраного'}" aria-pressed="${isFavorite ? 'true' : 'false'}">
                        <i class="fa-${isFavorite ? 'solid' : 'regular'} fa-heart"></i>
                    </button>

                    <div class="product-card-v2__badges">
                        ${meta.isNew ? '<span class="product-card-v2__badge product-card-v2__badge--new">Новинка</span>' : ''}
                        ${meta.isBestSeller ? '<span class="product-card-v2__badge product-card-v2__badge--top">Топ</span>' : ''}
                        <span class="product-card-v2__badge product-card-v2__badge--sale">-${meta.discount}%</span>
                    </div>
                </div>
                <div class="p-6 space-y-3">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">${item.category || 'Каталог'}</p>
                    <p class="font-semibold text-lg leading-snug text-slate-900">${item.title || 'Товар'}</p>

                    <div class="product-card-v2__rating">
                        <span class="product-card-v2__rating-star"><i class="fa-solid fa-star"></i></span>
                        <span class="font-semibold">${meta.rating}</span>
                        <span class="text-slate-500">(${meta.reviewCount} відгуків)</span>
                        ${meta.freeShipping ? '<span class="product-card-v2__shipping">Безкоштовна доставка</span>' : ''}
                    </div>

                    <div class="product-card-v2__price-row">
                        <span class="product-card-v2__price">${this.formatPrice(item.price)}</span>
                        ${originalPrice > Number(item.price || 0) ? `<span class="product-card-v2__price-old">${this.formatPrice(originalPrice)}</span>` : ''}
                    </div>

                    <div class="product-card-v2__meta-group">
                        <div>
                            <p class="product-card-v2__meta-label">Кольори</p>
                            <div class="product-card-v2__swatches">
                                ${meta.colors.map((color) => `<span class="product-card-v2__swatch" style="background:${color}"></span>`).join('')}
                            </div>
                        </div>
                        <div>
                            <p class="product-card-v2__meta-label">Розміри</p>
                            <div class="product-card-v2__sizes">
                                ${meta.sizes.map((size) => `<span class="product-card-v2__size">${size}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-6 pb-6 pt-1">
                    <button type="button" class="liquid-glass-btn product-card-v2__order-btn" data-action="order-product" data-index="${index}">
                        <i class="fa-solid fa-cart-shopping"></i>
                        Замовити цей товар
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
                this.openOrderModal(item);
                return;
            }

            if (action === 'toggle-favorite') {
                const favoriteTask = window.SiteAuth?.toggleFavorite?.(item);

                if (favoriteTask && typeof favoriteTask.catch === 'function') {
                    favoriteTask.catch((error) => {
                        console.warn('Failed to toggle favorite.', error);
                        alert('Не вдалося змінити обране. Спробуйте ще раз.');
                    });
                }
                return;
            }

            const galleryLength = Number(actionElement.getAttribute('data-gallery-length')) || this.buildGalleryUrls(item).length || 1;
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
    },

    getPrimaryImage(item) {
        if (item.image) return item.image;
        const mainImageId = item.main_image?.id || item.main_image;
        if (mainImageId) return `${this.CMS_URL}/assets/${mainImageId}`;
        return this.getDemoVisual(item.category, 0);
    },

    buildGalleryUrls(item) {
        if (Array.isArray(item.gallery) && item.gallery.length) {
            return item.gallery.map((entry) => {
                if (typeof entry === 'string') return entry;
                const assetId = entry?.id || entry;
                return assetId ? `${this.CMS_URL}/assets/${assetId}` : null;
            }).filter(Boolean);
        }

        const image = this.getPrimaryImage(item);
        return image ? [image] : [];
    },

    openProductModal(item) {
        const modal = document.getElementById('product-modal');
        if (!modal) return;

        this.state.currentItem = item;
        const gallery = this.buildGalleryUrls(item);
        const title = item.title || 'Товар';
        const category = item.category || 'Каталог';
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

        window.UI?.openModal('product-modal');
    },

    closeProductModal() {
        window.UI?.closeModal('product-modal');
    },

    openOrderModal(item) {
        if (!item) return;

        const orderTitle = document.getElementById('order-product-title');
        const orderPrice = document.getElementById('order-product-price');
        const qtyInput = document.getElementById('order-qty');
        const nameInput = document.getElementById('order-name');
        const phoneInput = document.getElementById('order-phone');
        const commentInput = document.getElementById('order-comment');
        const authHint = document.getElementById('order-auth-hint');
        const orderDefaults = window.SiteAuth?.getOrderPrefill?.() || {};

        if (orderTitle) orderTitle.textContent = item.title || 'Товар';
        if (orderPrice) orderPrice.textContent = this.formatPrice(item.price);
        if (qtyInput) qtyInput.value = '1';
        if (nameInput) nameInput.value = orderDefaults.name || '';
        if (phoneInput) phoneInput.value = orderDefaults.phone || '';
        if (commentInput) commentInput.value = '';
        if (authHint) {
            authHint.textContent = window.SiteAuth?.isAuthenticated?.()
                ? 'Замовлення буде збережене у вашому особистому кабінеті.'
                : 'Увійдіть, щоб зберігати замовлення у своєму кабінеті.';
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

        if (closeButton) closeButton.addEventListener('click', () => this.closeProductModal());
        if (backdrop) backdrop.addEventListener('click', () => this.closeProductModal());
        if (orderButton) {
            orderButton.addEventListener('click', () => {
                this.closeProductModal();
                this.openOrderModal(this.state.currentItem);
            });
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.closeProductModal();
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

                const qtyInput = document.getElementById('order-qty');
                const nameInput = document.getElementById('order-name');
                const phoneInput = document.getElementById('order-phone');
                const commentInput = document.getElementById('order-comment');
                const submitButton = document.getElementById('order-submit-btn');
                const title = this.state.currentItem?.title || 'Товар';
                const qty = Number(qtyInput?.value || 1);
                const name = nameInput?.value?.trim() || 'Без імені';
                const phone = phoneInput?.value?.trim() || 'Без телефону';
                const comment = commentInput?.value?.trim() || '—';

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = 'Зберігаємо...';
                }

                try {
                    const orderResult = await window.SiteAuth?.saveCatalogOrder?.({
                        item: this.state.currentItem,
                        quantity: qty,
                        contact_name: name,
                        contact_phone: phone,
                        comment
                    });

                    if (orderResult?.success) {
                        alert(`Замовлення збережено в кабінеті.\nТовар: ${title}\nКількість: ${qty}\nІм'я: ${name}\nТелефон: ${phone}`);
                        this.closeOrderModal();
                        return;
                    }

                    if (orderResult?.requiresAuth) {
                        alert('Щоб зберегти замовлення в особистий кабінет, спочатку увійдіть.');
                        window.location.href = orderResult.loginUrl || 'login.html';
                        return;
                    }

                    if (orderResult?.error) {
                        throw orderResult.error;
                    }

                    alert(`Замовлення прийнято в тестовому режимі.\nТовар: ${title}\nКількість: ${qty}\nІм'я: ${name}\nТелефон: ${phone}\nКоментар: ${comment}`);
                    this.closeOrderModal();
                } catch (error) {
                    console.warn('Order submission failed.', error);
                    alert('Не вдалося зберегти замовлення. Перевірте налаштування Supabase і спробуйте ще раз.');
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

    async init() {
        this.setupModalEvents();
        this.setupOrderModalEvents();
        const demoCategories = this.DEFAULT_CATEGORIES.slice();
        const demoProducts = this.generateDemoProducts(demoCategories);
        this.setCatalogData(demoCategories, demoProducts);

        try {
            const [categoriesResponse, productsResponse] = await Promise.all([
                fetch(`${this.CMS_URL}/items/categories?fields=id,title,sort&sort=sort,title`),
                fetch(`${this.CMS_URL}/items/products?fields=id,title,price,main_image,gallery,description,category.title&filter[status][_eq]=published&sort=sort,-date_created`)
            ]);

            let categories = [];
            let products = [];

            if (categoriesResponse.ok) {
                const categoryJson = await categoriesResponse.json();
                categories = (categoryJson.data || []).map((item) => item.title).filter(Boolean);
            }

            if (productsResponse.ok) {
                const productJson = await productsResponse.json();
                products = (productJson.data || []).map((item) => ({
                    title: item.title,
                    price: item.price,
                    main_image: item.main_image,
                    gallery: item.gallery,
                    description: item.description,
                    category: item.category?.title || item.category || 'Каталог'
                }));
            }

            if (!categories.length && products.length) {
                categories = Array.from(new Set(products.map((item) => item.category).filter(Boolean)));
            }

            if (categories.length || products.length) {
                this.setCatalogData(categories, products);
            }
        } catch (error) {
            console.warn('CMS недоступний, залишаю локальний демо-каталог.', error);
        }
    }
};

window.Catalog = Catalog;

