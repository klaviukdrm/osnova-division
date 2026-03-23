const AdminPanel = {
    STORAGE_PASSWORD_KEY: 'upf_admin_password',
    password: '',
    elements: {},

    cacheElements() {
        this.elements = {
            authForm: document.getElementById('admin-auth-form'),
            authInput: document.getElementById('admin-password'),
            authButton: document.getElementById('admin-auth-btn'),
            authStatus: document.getElementById('admin-auth-status'),
            formSection: document.getElementById('admin-form-section'),
            productForm: document.getElementById('admin-product-form'),
            submitButton: document.getElementById('admin-submit-btn'),
            submitStatus: document.getElementById('admin-submit-status'),
            refreshButton: document.getElementById('admin-refresh-btn'),
            productsList: document.getElementById('admin-products-list')
        };
    },

    setAuthState(isAuthed, message = '') {
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
        const adminPassword = String(password || '').trim();
        if (!adminPassword) {
            this.setAuthState(false, 'Введіть пароль адмінки.');
            return false;
        }

        try {
            this.setAuthPending(true);
            await this.requestApi('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'auth',
                    adminPassword
                })
            });
            this.password = adminPassword;
            window.sessionStorage.setItem(this.STORAGE_PASSWORD_KEY, adminPassword);
            this.setAuthState(true, 'Успішний вхід в адмінку.');
            return true;
        } catch (error) {
            this.password = '';
            window.sessionStorage.removeItem(this.STORAGE_PASSWORD_KEY);
            this.setAuthState(false, error.message || 'Невірний пароль.');
            return false;
        } finally {
            this.setAuthPending(false);
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

            return `
                <article class="rounded-xl border border-slate-700 p-3 sm:p-4">
                    <div class="flex items-start gap-3">
                        <div class="w-16 h-16 rounded-lg border border-slate-700 bg-slate-900 overflow-hidden shrink-0">
                            ${image ? `<img src="${image}" alt="${title}" class="w-full h-full object-cover" loading="lazy" decoding="async">` : ''}
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="font-semibold leading-tight">${title}</p>
                            <p class="text-sm text-slate-400 mt-1">${Number.isFinite(price) ? `${price} грн` : '0 грн'}</p>
                            ${description ? `<p class="text-xs text-slate-500 mt-1">${description}</p>` : ''}
                            <p class="text-xs text-slate-500 mt-1 break-all">${image}</p>
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

    collectFormPayload() {
        const title = String(document.getElementById('product-title')?.value || '').trim();
        const price = Number(document.getElementById('product-price')?.value || 0);
        const image = String(document.getElementById('product-image')?.value || '').trim();
        const description = String(document.getElementById('product-description')?.value || '').trim();
        return { title, price, image, description };
    },

    resetProductForm() {
        this.elements.productForm?.reset();
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

        this.elements.productForm?.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!this.password) {
                this.setSubmitState(false, 'Спочатку увійдіть у адмінку.');
                return;
            }

            const payload = this.collectFormPayload();
            if (!payload.title || !payload.image || !Number.isFinite(payload.price) || payload.price <= 0) {
                this.setSubmitState(false, 'Заповніть title, image та коректну price.');
                return;
            }

            try {
                this.setSubmitState(true, 'Додаємо товар...');
                await this.requestApi('/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-admin-password': this.password
                    },
                    body: JSON.stringify({
                        ...payload,
                        adminPassword: this.password
                    })
                });
                this.resetProductForm();
                this.setSubmitState(false, 'Товар успішно додано.');
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
        this.setAuthState(false);
        this.bindEvents();
        await this.loadProducts();

        const storedPassword = window.sessionStorage.getItem(this.STORAGE_PASSWORD_KEY) || '';
        if (storedPassword) {
            if (this.elements.authInput) {
                this.elements.authInput.value = storedPassword;
            }
            const ok = await this.authenticate(storedPassword);
            if (ok) {
                await this.loadProducts();
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AdminPanel.init();
});

