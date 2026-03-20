import { getSupabaseClient } from './supabase-client.js';

export const DEFAULT_ACCOUNT_PATH = 'account.html';

function normalizeFallbackPath(fallback = DEFAULT_ACCOUNT_PATH) {
    return fallback.startsWith('/') ? fallback : `/${fallback}`;
}

export function getCurrentRelativeUrl() {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export function sanitizeNextPath(rawValue, fallback = DEFAULT_ACCOUNT_PATH) {
    const normalizedFallback = normalizeFallbackPath(fallback);

    if (!rawValue) return normalizedFallback;

    try {
        const nextUrl = new URL(rawValue, window.location.origin);

        if (nextUrl.origin !== window.location.origin) {
            return normalizedFallback;
        }

        if (!/^https?:$/i.test(nextUrl.protocol)) {
            return normalizedFallback;
        }

        return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
    } catch (error) {
        return normalizedFallback;
    }
}

export function getNextPath(fallback = DEFAULT_ACCOUNT_PATH) {
    const params = new URLSearchParams(window.location.search);
    return sanitizeNextPath(params.get('next'), fallback);
}

export function buildLoginUrl(nextPath = getCurrentRelativeUrl()) {
    return `/login.html?next=${encodeURIComponent(nextPath)}`;
}

export function buildRegisterUrl(nextPath = getCurrentRelativeUrl()) {
    return `/register.html?next=${encodeURIComponent(nextPath)}`;
}

export function buildAccountUrl() {
    return normalizeFallbackPath(DEFAULT_ACCOUNT_PATH);
}

export function formatAuthError(error) {
    const message = error?.message || 'Authentication failed.';

    if (/invalid login credentials/i.test(message)) {
        return 'Невірний email або пароль.';
    }

    if (/email not confirmed/i.test(message)) {
        return 'Підтвердіть email у листі від Supabase, а потім увійдіть.';
    }

    if (/password should be at least/i.test(message)) {
        return 'Пароль має бути щонайменше 6 символів.';
    }

    if (/user already registered/i.test(message)) {
        return 'Користувач з таким email уже зареєстрований.';
    }

    return message;
}

export async function getAuthContext() {
    const client = await getSupabaseClient();
    const { data, error } = await client.auth.getSession();

    if (error) throw error;

    return {
        client,
        session: data.session || null,
        user: data.session?.user || null
    };
}

export async function redirectAuthenticatedUser(fallback = DEFAULT_ACCOUNT_PATH) {
    const auth = await getAuthContext();

    if (auth.user) {
        window.location.replace(getNextPath(fallback));
        return true;
    }

    return false;
}

export async function requireAuthenticatedUser(nextPath = DEFAULT_ACCOUNT_PATH) {
    const auth = await getAuthContext();

    if (!auth.user) {
        window.location.replace(buildLoginUrl(nextPath));
        return null;
    }

    return auth;
}

export async function signUpWithEmail({ email, password, fullName }) {
    const client = await getSupabaseClient();

    const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            },
            emailRedirectTo: new URL('/account.html', window.location.origin).toString()
        }
    });

    if (error) throw error;
    return data;
}

export async function signInWithEmail({ email, password }) {
    const client = await getSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) throw error;
    return data;
}

export async function signOutCurrentUser() {
    const client = await getSupabaseClient();
    const { error } = await client.auth.signOut();

    if (error) throw error;
}

export async function onAuthStateChange(handler) {
    const client = await getSupabaseClient();
    return client.auth.onAuthStateChange(handler);
}