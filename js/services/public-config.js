let configPromise;

async function parseConfigResponse(response) {
    let payload = {};

    try {
        payload = await response.json();
    } catch (error) {
        payload = {};
    }

    if (!response.ok) {
        throw new Error(payload.error || 'Failed to load public app configuration.');
    }

    if (!payload.supabaseUrl || !payload.supabaseAnonKey) {
        throw new Error('Supabase public configuration is incomplete. Fill SUPABASE_URL and SUPABASE_ANON_KEY.');
    }

    return payload;
}

export async function getPublicConfig() {
    if (!configPromise) {
        configPromise = fetch('/api/public-config', {
            headers: {
                Accept: 'application/json'
            }
        }).then(parseConfigResponse);
    }

    return configPromise;
}
