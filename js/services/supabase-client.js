import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { getPublicConfig } from './public-config.js';

let supabasePromise;

export async function getSupabaseClient() {
    if (!supabasePromise) {
        supabasePromise = (async () => {
            const { supabaseUrl, supabaseAnonKey } = await getPublicConfig();

            return createClient(supabaseUrl, supabaseAnonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            });
        })();
    }

    return supabasePromise;
}
