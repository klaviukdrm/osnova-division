import {
    buildAccountUrl,
    buildLoginUrl,
    getCurrentRelativeUrl,
    onAuthStateChange
} from './services/auth-api.js';
import { getSupabaseClient } from './services/supabase-client.js';
import {
    addFavorite,
    createOrderFromCatalogItem,
    fetchFavorites,
    fetchProfile,
    removeFavorite,
    slugifyProduct
} from './services/account-api.js';

const state = {
    client: null,
    user: null,
    profile: null,
    favorites: [],
    favoriteKeys: new Set(),
    initError: null,
    readyPromise: null,
    authSubscription: null
};

function applyAuthLinkState() {
    const isAuthenticated = Boolean(state.user);
    const currentPath = window.location.pathname.toLowerCase();
    const nextPath = currentPath.endsWith('/login.html') || currentPath.endsWith('/register.html')
        ? buildAccountUrl()
        : getCurrentRelativeUrl();

    document.querySelectorAll('[data-auth-link]').forEach((link) => {
        link.setAttribute('href', isAuthenticated ? buildAccountUrl() : buildLoginUrl(nextPath));
    });

    document.querySelectorAll('[data-auth-label]').forEach((label) => {
        label.textContent = isAuthenticated ? 'Кабінет' : 'Увійти';
    });
}

function setFavoriteState(favorites) {
    state.favorites = favorites || [];
    state.favoriteKeys = new Set(state.favorites.map((item) => item.product_slug));
}

async function hydrateUserState() {
    if (!state.client || !state.user) {
        state.profile = null;
        setFavoriteState([]);
        return;
    }

    const [profile, favorites] = await Promise.all([
        fetchProfile(state.client, state.user.id),
        fetchFavorites(state.client, state.user.id)
    ]);

    state.profile = profile;
    setFavoriteState(favorites);
}

function notifyStateChange() {
    document.dispatchEvent(new CustomEvent('siteauth:statechange', {
        detail: {
            user: state.user,
            profile: state.profile,
            favorites: state.favorites,
            initError: state.initError
        }
    }));
}

function refreshCatalogView() {
    if (window.Catalog && typeof window.Catalog.renderProducts === 'function') {
        window.Catalog.renderProducts();
    }
}

function applyOrderFormDefaults() {
    const nameInput = document.getElementById('order-name');
    const phoneInput = document.getElementById('order-phone');
    const hint = document.getElementById('order-auth-hint');

    if (hint) {
        hint.textContent = state.user
            ? 'Замовлення буде збережене у вашому особистому кабінеті.'
            : 'Увійдіть, щоб зберігати замовлення та обране у своєму кабінеті.';
    }

    if (nameInput && !nameInput.value) {
        nameInput.value = state.profile?.full_name || state.user?.user_metadata?.full_name || '';
    }

    if (phoneInput && !phoneInput.value) {
        phoneInput.value = state.profile?.phone || '';
    }
}

async function bootstrap() {
    applyAuthLinkState();

    try {
        state.client = await getSupabaseClient();
        const { data, error } = await state.client.auth.getSession();

        if (error) throw error;

        state.user = data.session?.user || null;
        state.initError = null;

        if (state.user) {
            await hydrateUserState();
        } else {
            state.profile = null;
            setFavoriteState([]);
        }

        const authChannel = await onAuthStateChange(async (_event, session) => {
            state.user = session?.user || null;

            if (state.user) {
                await hydrateUserState();
            } else {
                state.profile = null;
                setFavoriteState([]);
            }

            applyAuthLinkState();
            applyOrderFormDefaults();
            refreshCatalogView();
            notifyStateChange();
        });

        state.authSubscription = authChannel?.data?.subscription || authChannel?.subscription || null;
    } catch (error) {
        state.initError = error;
        console.warn('Supabase auth is not configured yet.', error);
    }

    applyAuthLinkState();
    applyOrderFormDefaults();
    refreshCatalogView();
    notifyStateChange();
    return state;
}

const SiteAuth = {
    ready() {
        if (!state.readyPromise) {
            state.readyPromise = bootstrap();
        }

        return state.readyPromise;
    },

    isAuthenticated() {
        return Boolean(state.user);
    },

    getCurrentUser() {
        return state.user;
    },

    getCurrentProfile() {
        return state.profile;
    },

    getInitError() {
        return state.initError;
    },

    getOrderPrefill() {
        return {
            name: state.profile?.full_name || state.user?.user_metadata?.full_name || '',
            phone: state.profile?.phone || ''
        };
    },

    getLoginUrl() {
        return buildLoginUrl(getCurrentRelativeUrl());
    },

    isFavoriteProduct(item) {
        return state.favoriteKeys.has(slugifyProduct(item));
    },

    async toggleFavorite(item) {
        await this.ready();

        if (state.initError) {
            return {
                error: state.initError
            };
        }

        if (!state.user) {
            const loginUrl = buildLoginUrl(getCurrentRelativeUrl());
            window.location.assign(loginUrl);
            return {
                requiresAuth: true,
                loginUrl
            };
        }

        const productSlug = slugifyProduct(item);

        if (state.favoriteKeys.has(productSlug)) {
            await removeFavorite(state.client, state.user.id, productSlug);
            setFavoriteState(state.favorites.filter((favorite) => favorite.product_slug !== productSlug));
            refreshCatalogView();
            notifyStateChange();

            return {
                removed: true
            };
        }

        const favorite = await addFavorite(state.client, state.user.id, item);
        setFavoriteState([favorite, ...state.favorites.filter((entry) => entry.product_slug !== favorite.product_slug)]);
        refreshCatalogView();
        notifyStateChange();

        return {
            added: true,
            favorite
        };
    },

    async saveCatalogOrder(payload) {
        await this.ready();

        if (state.initError) {
            return {
                error: state.initError
            };
        }

        if (!state.user) {
            return {
                requiresAuth: true,
                loginUrl: buildLoginUrl(getCurrentRelativeUrl())
            };
        }

        const order = await createOrderFromCatalogItem(state.client, state.user, payload);

        return {
            success: true,
            order
        };
    }
};

window.SiteAuth = SiteAuth;

document.addEventListener('DOMContentLoaded', () => {
    SiteAuth.ready().catch((error) => {
        console.warn('Site auth bootstrap failed.', error);
    });
});