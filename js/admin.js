const AdminPanel = {
    MAX_IMAGE_SIDE: 1800,
    JPEG_QUALITY: 0.9,
    DEFAULT_PRICE: 650,
    DEFAULT_IMAGE_PATH: 'images/muzhskaya-futbolka-belaya-1005.png',
    isAuthenticated: false,
    selectedFileDataUrl: '',
    selectedFileName: '',
    descriptionAutoMode: true,
    categoryOptions: [
        {
            value: 'Футболки',
            subcategories: [
                'Футболка з надруком',
                'Футболка з двостороннім надруком'
            ]
        },
        {
            value: 'Худі',
            subcategories: [
                'Худі з надруком',
                'Худі oversize'
            ]
        },
        {
            value: 'Чашки',
            subcategories: [
                'Керамічна чашка з надруком',
                'Чашка з двостороннім надруком'
            ]
        },
        {
            value: 'Термочашки',
            subcategories: [
                'Термочашка з надруком'
            ]
        },
        {
            value: 'Подарункові набори',
            subcategories: [
                'Подарунковий набір',
                'Подарунковий набір з футболкою',
                'Подарунковий набір з чашкою'
            ]
        },
        {
            value: 'Сумки-шопери',
            subcategories: [
                'Сумка-шопер з надруком',
                'Сумка-шопер з власним принтом'
            ]
        }
    ],
    elements: {},

    cacheElements() {
        this.elements = {
            authForm: document.getElementById('admin-auth-form'),
            authInput: document.getElementById('admin-password'),
            authButton: document.getElementById('admin-auth-btn'),
            authStatus: document.getElementById('admin-auth-status'),
            formSection: document.getElementById('admin-form-section'),
            productsSection: document.getElementById('admin-products-section'),
            productForm: document.getElementById('admin-product-form'),
            submitButton: document.getElementById('admin-submit-btn'),
            submitStatus: document.getElementById('admin-submit-status'),
            refreshButton: document.getElementById('admin-refresh-btn'),
            productsList: document.getElementById('admin-products-list'),
            titleInput: document.getElementById('product-title'),
            priceInput: document.getElementById('product-price'),
            descriptionInput: document.getElementById('product-description'),
            categorySelect: document.getElementById('product-category'),
            subcategorySelect: document.getElementById('product-subcategory'),
            imageFileInput: document.getElementById('product-image-file'),
            imageUrlInput: document.getElementById('product-image'),
            imagePreviewWrap: document.getElementById('product-image-preview-wrap'),
            imagePreview: document.getElementById('product-image-preview')
        };
    },

    getCategoryConfig(categoryValue) {
        return this.categoryOptions.find((item) => item.value === categoryValue) || this.categoryOptions[0];
    },

    populateCategorySelect() {
        const select = this.elements.categorySelect;
        if (!select) return;
        select.innerHTML = this.categoryOptions
            .map((item) => `<option value="${item.value}">${item.value}</option>`)
            .join('');
    },

    populateSubcategorySelect(categoryValue, preferredSubcategory = '') {
        const select = this.elements.subcategorySelect;
        if (!select) return;
        const config = this.getCategoryConfig(categoryValue);
        const subcategories = Array.isArray(config.subcategories) && config.subcategories.length
            ? config.subcategories
            : ['Без підкатегорії'];
        const selectedValue = subcategories.includes(preferredSubcategory) ? preferredSubcategory : subcategories[0];

        select.innerHTML = subcategories
            .map((value) => `<option value="${value}" ${value === selectedValue ? 'selected' : ''}>${value}</option>`)
            .join('');
    },

    buildAutoDescription(title, category, subcategory) {
        const safeTitle = String(title || '').trim();
        const safeCategory = String(category || '').trim();
        const safeSubcategory = String(subcategory || '').trim();
        if (!safeTitle) return '';

        if (safeSubcategory) {
            return `Готовий товар «${safeTitle}». Категорія: ${safeCategory}. Тип: ${safeSubcategory}.`;
        }
        return `Готовий товар «${safeTitle}». Категорія: ${safeCategory}.`;
    },

    applyAutoValuesFromTitle() {
        const title = String(this.elements.titleInput?.value || '').trim();
        if (!title) return;

        if (this.elements.priceInput && !String(this.elements.priceInput.value || '').trim()) {
            this.elements.priceInput.value = String(this.DEFAULT_PRICE);
        }

        if (!this.descriptionAutoMode) return;
        const category = String(this.elements.categorySelect?.value || '').trim();
        const subcategory = String(this.elements.subcategorySelect?.value || '').trim();
        const nextDescription = this.buildAutoDescription(title, category, subcategory);
        if (this.elements.descriptionInput) {
            this.elements.descriptionInput.value = nextDescription;
        }
    },

    setAuthState(isAuthed, message = '') {
        this.isAuthenticated = Boolean(isAuthed);
        const statusMessage = message || (isAuthed ? 'Доступ відкрито.' : 'Доступ до додавання товарів закритий.');
        if (this.elements.authStatus) {
            this.elements.authStatus.textContent = statusMessage;
            this.elements.authStatus.classList.toggle('text-emerald-400', isAuthed);
            this.elements.authStatus.classList.toggle('text-red-400', !isAuthed && Boolean(message));
            this.elements.authStatus.classList.toggle('text-slate-400', !isAuthed && !message);
        }
        if (this.elements.formSection) {
            this.elements.formSection.classList.toggle('hidden', !isAuthed);
        }
        if (this.elements.productsSection) {
            this.elements.productsSection.classList.toggle('hidden', !isAuthed);
        }
    },

    setSubmitState(isPending, message = '') {
        if (this.elements.submitButton) {
            this.elements.submitButton.disabled = isPending;
            this.elements.submitButton.classList.toggle('opacity-60', isPending);
            this.elements.submitButton.classList.toggle('pointer-events-none', isPending);
        }
        if (message && this.elements.submitStatus) {
            this.elements.submitStatus.textContent = message;
        }
    },

    setAuthPending(isPending) {
        if (!this.elements.authButton) return;
        this.elements.authButton.disabled = isPending;
        this.elements.authButton.classList.toggle('opacity-60', isPending);
        this.elements.authButton.classList.toggle('pointer-events-none', isPending);
    },

    async requestApi(path, options = {}) {
        const response = await fetch(path, {
            credentials: 'same-origin',
            ...options,
            headers: {
                Accept: 'application/json',
                ...(options.headers || {})
            }
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
            const error = new Error(payload?.error || `HTTP ${response.status}`);
            error.payload = payload;
            error.status = response.status;
            throw error;
        }
        return payload;
    },

    async authenticate(password) {
        const plainPassword = String(password || '').trim();
        if (!plainPassword) {
            this.setAuthState(false, 'Введіть пароль адмінки.');
            return false;
        }

        try {
            this.setAuthPending(true);
            await this.requestApi('/api/admin/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: plainPassword
                })
            });
            this.setAuthState(true, 'Успішний вхід в адмінку.');
            if (this.elements.authInput) {
                this.elements.authInput.value = '';
            }
            return true;
        } catch (error) {
            this.setAuthState(false, error.message || 'Невірний пароль.');
            return false;
        } finally {
            this.setAuthPending(false);
        }
    },

    async checkSession() {
        try {
            const payload = await this.requestApi('/api/admin/session', {
                method: 'GET'
            });
            return Boolean(payload?.authenticated);
        } catch (_) {
            return false;
        }
    },

    renderProducts(products) {
        const list = this.elements.productsList;
        if (!list) return;

        if (!Array.isArray(products) || !products.length) {
            list.innerHTML = '<p class="text-sm text-slate-400">У базі поки немає товарів.</p>';
            return;
        }

        list.innerHTML = products.map((product) => {
            const title = String(product?.title || 'Без назви');
            const price = Number(product?.price || 0);
            const image = String(product?.image || '').trim();
            const description = String(product?.description || '').trim();
            const category = String(product?.category || '').trim() || 'Футболки';
            const subcategory = String(product?.subcategory || product?.display_category || '').trim();

            return `
                <article class="rounded-xl border border-slate-700 p-3 sm:p-4">
                    <div class="flex items-start gap-3">
                        <div class="w-16 h-16 rounded-lg border border-slate-700 bg-slate-900 overflow-hidden shrink-0">
                            ${image ? `<img src="${image}" alt="${title}" class="w-full h-full object-cover" loading="lazy" decoding="async">` : ''}
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="font-semibold leading-tight">${title}</p>
                            <p class="text-sm text-slate-400 mt-1">${Number.isFinite(price) ? `${price} грн` : '0 грн'}</p>
                            <p class="text-xs text-slate-500 mt-1">${category}${subcategory ? ` • ${subcategory}` : ''}</p>
                            ${description ? `<p class="text-xs text-slate-500 mt-1">${description}</p>` : ''}
                            <p class="text-xs text-slate-500 mt-1 break-all">${image}</p>
                            <div class="mt-2">
                                <button type="button" class="liquid-glass-btn px-3 py-1.5 rounded-lg text-xs font-semibold border-red-500" data-delete-product-id="${product?.id || ''}">
                                    Видалити
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    },

    async loadProducts() {
        try {
            if (this.elements.refreshButton) {
                this.elements.refreshButton.disabled = true;
            }
            const payload = await this.requestApi('/api/products', { method: 'GET' });
            this.renderProducts(payload?.products || []);
        } catch (error) {
            if (this.elements.productsList) {
                this.elements.productsList.innerHTML = `<p class="text-sm text-red-400">Не вдалося отримати товари: ${error.message}</p>`;
            }
        } finally {
            if (this.elements.refreshButton) {
                this.elements.refreshButton.disabled = false;
            }
        }
    },

    async deleteProductById(productId) {
        const id = Number(productId);
        if (!Number.isFinite(id) || id <= 0) {
            this.setSubmitState(false, 'Некоректний id товару.');
            window.UI?.showToast?.('Некоректний id товару', { tone: 'warning' });
            return;
        }

        if (!this.isAuthenticated) {
            this.setSubmitState(false, 'Спочатку увійдіть у адмінку.');
            window.UI?.showToast?.('Спочатку увійдіть у адмінку', { tone: 'warning' });
            return;
        }

        const confirmed = window.confirm(`Видалити товар #${id}?`);
        if (!confirmed) return;

        try {
            this.setSubmitState(true, 'Видаляємо товар...');
            await this.requestApi(`/api/products?id=${encodeURIComponent(String(id))}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id
                })
            });
            this.setSubmitState(false, 'Товар видалено.');
            window.UI?.showToast?.('Товар видалено', { tone: 'info' });
            await this.loadProducts();
        } catch (error) {
            this.setSubmitState(false, `Помилка видалення: ${error.message}`);
            window.UI?.showToast?.(`Помилка видалення: ${error.message}`, { tone: 'warning' });
        }
    },

    fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('Не вдалося прочитати файл.'));
            reader.readAsDataURL(file);
        });
    },

    loadImageFromDataUrl(dataUrl) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error('Не вдалося обробити зображення.'));
            image.src = dataUrl;
        });
    },

    async optimizeImageDataUrl(file) {
        const rawDataUrl = await this.fileToDataUrl(file);

        try {
            const image = await this.loadImageFromDataUrl(rawDataUrl);
            const maxSide = Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height);
            const scale = maxSide > this.MAX_IMAGE_SIDE ? this.MAX_IMAGE_SIDE / maxSide : 1;
            const targetWidth = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
            const targetHeight = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));

            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return rawDataUrl;
            ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
            return canvas.toDataURL('image/jpeg', this.JPEG_QUALITY);
        } catch (_) {
            return rawDataUrl;
        }
    },

    setImagePreview(imageUrl) {
        const hasImage = Boolean(imageUrl);
        if (this.elements.imagePreviewWrap) {
            this.elements.imagePreviewWrap.classList.toggle('hidden', !hasImage);
        }
        if (this.elements.imagePreview) {
            this.elements.imagePreview.src = hasImage ? imageUrl : '';
        }
    },

    async handleImageFileChange() {
        const file = this.elements.imageFileInput?.files?.[0];
        if (!file) {
            this.selectedFileDataUrl = '';
            this.selectedFileName = '';
            this.setImagePreview(this.elements.imageUrlInput?.value?.trim() || '');
            return;
        }

        try {
            const dataUrl = await this.optimizeImageDataUrl(file);
            this.selectedFileDataUrl = dataUrl;
            this.selectedFileName = file.name;
            this.setImagePreview(dataUrl);
        } catch (error) {
            this.selectedFileDataUrl = '';
            this.selectedFileName = '';
            this.setImagePreview('');
            window.UI?.showToast?.(error.message, { tone: 'warning' });
        }
    },

    async uploadSelectedImage(category) {
        if (!this.selectedFileDataUrl) {
            return '';
        }

        const payload = await this.requestApi('/api/products/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category,
                fileName: this.selectedFileName || 'product-image.jpg',
                dataUrl: this.selectedFileDataUrl
            })
        });

        return String(payload?.publicUrl || '').trim();
    },

    collectFormPayload(imageUrl) {
        const title = String(this.elements.titleInput?.value || '').trim();
        const rawPrice = String(this.elements.priceInput?.value || '').trim();
        const price = Number(rawPrice || this.DEFAULT_PRICE);
        const category = String(this.elements.categorySelect?.value || '').trim() || this.categoryOptions[0]?.value || 'Футболки';
        const subcategory = String(this.elements.subcategorySelect?.value || '').trim();
        const rawDescription = String(this.elements.descriptionInput?.value || '').trim();
        const description = rawDescription || this.buildAutoDescription(title, category, subcategory);
        const safeImage = String(imageUrl || '').trim() || this.DEFAULT_IMAGE_PATH;
        return {
            title,
            price,
            image: safeImage,
            description,
            category,
            subcategory
        };
    },

    resetProductForm() {
        this.elements.productForm?.reset();
        this.selectedFileDataUrl = '';
        this.selectedFileName = '';
        this.descriptionAutoMode = true;
        this.populateCategorySelect();
        this.populateSubcategorySelect(this.categoryOptions[0]?.value || 'Футболки');
        this.setImagePreview('');
        if (this.elements.priceInput) {
            this.elements.priceInput.value = String(this.DEFAULT_PRICE);
        }
    },

    bindEvents() {
        this.elements.authForm?.addEventListener('submit', async (event) => {
            event.preventDefault();
            const password = this.elements.authInput?.value || '';
            const ok = await this.authenticate(password);
            if (ok) {
                await this.loadProducts();
            }
        });

        this.elements.categorySelect?.addEventListener('change', () => {
            const category = this.elements.categorySelect?.value || this.categoryOptions[0]?.value;
            this.populateSubcategorySelect(category);
            this.applyAutoValuesFromTitle();
        });

        this.elements.subcategorySelect?.addEventListener('change', () => {
            this.applyAutoValuesFromTitle();
        });

        this.elements.titleInput?.addEventListener('input', () => {
            this.applyAutoValuesFromTitle();
        });

        this.elements.descriptionInput?.addEventListener('input', () => {
            const value = String(this.elements.descriptionInput?.value || '').trim();
            this.descriptionAutoMode = !value;
        });

        this.elements.imageFileInput?.addEventListener('change', async () => {
            await this.handleImageFileChange();
        });

        this.elements.imageUrlInput?.addEventListener('input', () => {
            if (this.selectedFileDataUrl) return;
            const value = this.elements.imageUrlInput?.value?.trim() || '';
            this.setImagePreview(value);
        });

        this.elements.productsList?.addEventListener('click', async (event) => {
            const button = event.target.closest('[data-delete-product-id]');
            if (!button) return;
            const id = String(button.getAttribute('data-delete-product-id') || '').trim();
            if (!id) return;
            await this.deleteProductById(id);
        });

        this.elements.productForm?.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!this.isAuthenticated) {
                this.setSubmitState(false, 'Спочатку увійдіть у адмінку.');
                return;
            }

            const category = String(this.elements.categorySelect?.value || '').trim() || 'Футболки';
            const manualImage = String(this.elements.imageUrlInput?.value || '').trim();

            try {
                this.setSubmitState(true, 'Готуємо зображення...');
                let imageUrl = manualImage;

                if (this.selectedFileDataUrl) {
                    this.setSubmitState(true, 'Завантажуємо файл у Supabase Storage...');
                    imageUrl = await this.uploadSelectedImage(category);
                }

                const payload = this.collectFormPayload(imageUrl);
                if (!payload.title || !Number.isFinite(payload.price) || payload.price <= 0) {
                    this.setSubmitState(false, 'Заповніть назву товару та коректну ціну.');
                    return;
                }

                this.setSubmitState(true, 'Додаємо товар у базу...');
                const result = await this.requestApi('/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                this.resetProductForm();
                this.setSubmitState(false, result?.warning || 'Товар успішно додано.');
                window.UI?.showToast?.('Товар додано', { tone: 'info' });
                await this.loadProducts();
            } catch (error) {
                this.setSubmitState(false, `Помилка: ${error.message}`);
            }
        });

        this.elements.refreshButton?.addEventListener('click', async () => {
            await this.loadProducts();
        });
    },

    async init() {
        this.cacheElements();
        this.populateCategorySelect();
        this.populateSubcategorySelect(this.categoryOptions[0]?.value || 'Футболки');
        if (this.elements.priceInput) {
            this.elements.priceInput.value = String(this.DEFAULT_PRICE);
        }
        this.setAuthState(false);
        this.bindEvents();
        const hasSession = await this.checkSession();
        this.setAuthState(hasSession, hasSession ? 'Сесію адміна підтверджено.' : 'Доступ до додавання товарів закритий.');
        if (hasSession) {
            await this.loadProducts();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AdminPanel.init();
});
