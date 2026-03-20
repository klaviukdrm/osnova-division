import {
    buildLoginUrl,
    formatAuthError,
    onAuthStateChange,
    requireAuthenticatedUser,
    signOutCurrentUser
} from '../services/auth-api.js';
import {
    fetchFavorites,
    fetchOrders,
    fetchProfile,
    formatCurrency,
    formatOrderDate,
    getStatusLabel,
    removeFavorite,
    upsertProfile
} from '../services/account-api.js';

const state = {
    client: null,
    user: null,
    profile: null,
    orders: [],
    favorites: [],
    authSubscription: null
};

function setFeedback(message, tone = 'neutral') {
    const feedback = document.getElementById('account-feedback');
    if (!feedback) return;

    const tones = {
        neutral: 'auth-feedback auth-feedback--neutral',
        error: 'auth-feedback auth-feedback--error',
        success: 'auth-feedback auth-feedback--success'
    };

    feedback.className = tones[tone] || tones.neutral;
    feedback.textContent = message;
    feedback.classList.remove('hidden');
}

function setLoading(isLoading) {
    const loading = document.getElementById('account-loading');
    const content = document.getElementById('account-content');

    if (loading) loading.classList.toggle('hidden', !isLoading);
    if (content) content.classList.toggle('hidden', isLoading);
}

function fillProfileForm() {
    const profile = state.profile || {};
    const fullNameInput = document.getElementById('profile-full-name');
    const phoneInput = document.getElementById('profile-phone');
    const cityInput = document.getElementById('profile-city');
    const avatarInput = document.getElementById('profile-avatar-url');
    const emailValue = document.getElementById('profile-email-value');
    const accountEmail = document.getElementById('account-email');
    const accountName = document.getElementById('account-name');

    if (fullNameInput) fullNameInput.value = profile.full_name || state.user?.user_metadata?.full_name || '';
    if (phoneInput) phoneInput.value = profile.phone || '';
    if (cityInput) cityInput.value = profile.city || '';
    if (avatarInput) avatarInput.value = profile.avatar_url || '';
    if (emailValue) emailValue.value = state.user?.email || profile.email || '';
    if (accountEmail) accountEmail.textContent = state.user?.email || profile.email || '—';
    if (accountName) {
        accountName.textContent = profile.full_name || state.user?.user_metadata?.full_name || 'Ваш кабінет';
    }
}

function renderOrders() {
    const container = document.getElementById('orders-list');
    if (!container) return;

    if (!state.orders.length) {
        container.innerHTML = `
            <div class="account-empty-state">
                <h3 class="text-xl font-semibold text-slate-900">Поки що немає замовлень</h3>
                <p class="text-slate-600 mt-2">Коли ви оформите замовлення після входу, воно з'явиться тут разом зі статусом і складом.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = state.orders.map((order) => `
        <article class="account-card space-y-5">
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Замовлення</p>
                    <h3 class="text-2xl font-semibold text-slate-900 mt-2">#${order.id.slice(0, 8).toUpperCase()}</h3>
                    <p class="text-sm text-slate-500 mt-2">${formatOrderDate(order.created_at)}</p>
                </div>
                <div class="text-right">
                    <span class="account-status-pill">${getStatusLabel(order.status)}</span>
                    <p class="text-2xl font-semibold text-blue-700 mt-3">${formatCurrency(order.total_amount, order.currency || 'UAH')}</p>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                <div class="preview-detail-card">
                    <span class="preview-detail-card__label">Контакт</span>
                    <strong>${order.contact_name || '—'}</strong>
                </div>
                <div class="preview-detail-card">
                    <span class="preview-detail-card__label">Телефон</span>
                    <strong>${order.contact_phone || '—'}</strong>
                </div>
            </div>

            <div class="space-y-3">
                <p class="text-sm font-semibold text-slate-900">Склад замовлення</p>
                ${(order.order_items || []).map((item) => `
                    <div class="account-line-item">
                        <div class="flex items-center gap-4">
                            <div class="account-line-item__image-wrap">
                                ${item.product_image_url ? `<img src="${item.product_image_url}" alt="${item.product_title}" class="account-line-item__image">` : '<span class="text-xs text-slate-500">Фото</span>'}
                            </div>
                            <div>
                                <p class="font-semibold text-slate-900">${item.product_title}</p>
                                <p class="text-sm text-slate-500">${item.product_category || 'Каталог'}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold text-slate-900">${formatCurrency(item.line_total || (item.unit_price * item.quantity), order.currency || 'UAH')}</p>
                            <p class="text-sm text-slate-500">${item.quantity} шт. x ${formatCurrency(item.unit_price, order.currency || 'UAH')}</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            ${order.comment ? `<div class="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-600"><strong class="text-slate-900">Коментар:</strong> ${order.comment}</div>` : ''}
        </article>
    `).join('');
}

function renderFavorites() {
    const container = document.getElementById('favorites-list');
    if (!container) return;

    if (!state.favorites.length) {
        container.innerHTML = `
            <div class="account-empty-state">
                <h3 class="text-xl font-semibold text-slate-900">Обране порожнє</h3>
                <p class="text-slate-600 mt-2">Додавайте товари з каталогу в обране, і вони з'являться тут.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            ${state.favorites.map((favorite) => `
                <article class="account-card flex flex-col gap-5">
                    <div class="flex items-start gap-4">
                        <div class="account-favorite-image-wrap">
                            ${favorite.product_image_url ? `<img src="${favorite.product_image_url}" alt="${favorite.product_title}" class="account-favorite-image">` : '<span class="text-xs text-slate-500">Фото</span>'}
                        </div>
                        <div class="flex-1">
                            <p class="text-xs uppercase tracking-[0.22em] text-slate-400">${favorite.product_category || 'Каталог'}</p>
                            <h3 class="text-xl font-semibold text-slate-900 mt-2">${favorite.product_title}</h3>
                            <p class="text-blue-700 font-semibold mt-3">${formatCurrency(favorite.product_price || 0)}</p>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-3 mt-auto">
                        <a href="${favorite.product_url || '/index.html#products'}" class="px-5 py-3 rounded-2xl border border-slate-200 hover:border-blue-700 transition font-medium text-sm">Перейти до каталогу</a>
                        <button type="button" class="px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-medium" data-remove-favorite="${favorite.product_slug}">Прибрати з обраного</button>
                    </div>
                </article>
            `).join('')}
        </div>
    `;
}

function activateTab(nextTab) {
    document.querySelectorAll('[data-account-tab]').forEach((button) => {
        const isActive = button.getAttribute('data-account-tab') === nextTab;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });

    document.querySelectorAll('[data-account-panel]').forEach((panel) => {
        panel.classList.toggle('hidden', panel.getAttribute('data-account-panel') !== nextTab);
    });
}

async function loadAccountData() {
    const [profile, orders, favorites] = await Promise.all([
        fetchProfile(state.client, state.user.id),
        fetchOrders(state.client, state.user.id),
        fetchFavorites(state.client, state.user.id)
    ]);

    state.profile = profile;
    state.orders = orders;
    state.favorites = favorites;

    fillProfileForm();
    renderOrders();
    renderFavorites();
}

async function handleProfileSubmit(event) {
    event.preventDefault();

    const payload = {
        full_name: document.getElementById('profile-full-name')?.value?.trim() || '',
        phone: document.getElementById('profile-phone')?.value?.trim() || '',
        city: document.getElementById('profile-city')?.value?.trim() || '',
        avatar_url: document.getElementById('profile-avatar-url')?.value?.trim() || ''
    };

    const submitButton = document.getElementById('profile-submit');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Зберігаємо...';
    }

    try {
        state.profile = await upsertProfile(state.client, state.user, payload);
        fillProfileForm();
        setFeedback('Профіль оновлено.', 'success');
    } catch (error) {
        setFeedback(formatAuthError(error), 'error');
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Зберегти зміни';
        }
    }
}

async function handleFavoriteClick(event) {
    const button = event.target.closest('[data-remove-favorite]');
    if (!button) return;

    const productSlug = button.getAttribute('data-remove-favorite');
    if (!productSlug) return;

    button.disabled = true;

    try {
        await removeFavorite(state.client, state.user.id, productSlug);
        state.favorites = state.favorites.filter((item) => item.product_slug !== productSlug);
        renderFavorites();
        setFeedback('Товар прибрано з обраного.', 'success');
    } catch (error) {
        button.disabled = false;
        setFeedback(formatAuthError(error), 'error');
    }
}

async function handleSignOut() {
    const logoutButton = document.getElementById('account-logout-btn');
    if (logoutButton) {
        logoutButton.disabled = true;
        logoutButton.textContent = 'Виходимо...';
    }

    try {
        await signOutCurrentUser();
        window.location.replace(buildLoginUrl('/account.html'));
    } catch (error) {
        setFeedback(formatAuthError(error), 'error');
        if (logoutButton) {
            logoutButton.disabled = false;
            logoutButton.textContent = 'Вийти';
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const profileForm = document.getElementById('profile-form');
    const favoritesList = document.getElementById('favorites-list');
    const logoutButton = document.getElementById('account-logout-btn');

    document.querySelectorAll('[data-account-tab]').forEach((button) => {
        button.addEventListener('click', () => {
            activateTab(button.getAttribute('data-account-tab'));
        });
    });

    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }

    if (favoritesList) {
        favoritesList.addEventListener('click', handleFavoriteClick);
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', handleSignOut);
    }

    activateTab('profile');
    setLoading(true);

    try {
        const auth = await requireAuthenticatedUser('/account.html');
        if (!auth) return;

        state.client = auth.client;
        state.user = auth.user;

        const authChannel = await onAuthStateChange((_event, session) => {
            if (!session?.user) {
                window.location.replace(buildLoginUrl('/account.html'));
            }
        });

        state.authSubscription = authChannel?.data?.subscription || authChannel?.subscription || null;

        await loadAccountData();
        setLoading(false);
    } catch (error) {
        setLoading(false);
        setFeedback(error.message || 'Не вдалося завантажити особистий кабінет.', 'error');
    }
});

window.addEventListener('beforeunload', () => {
    state.authSubscription?.unsubscribe?.();
});