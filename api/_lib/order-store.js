const ORDERS_TABLE = 'orders';

function getSupabaseConfig() {
    const url = String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
    const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
    const anonKey = String(process.env.SUPABASE_ANON_KEY || '').trim();
    const key = serviceRoleKey || anonKey;
    if (!url || !key) {
        throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) are required');
    }
    return { url, key };
}

function encode(value) {
    return encodeURIComponent(String(value || '').trim());
}

async function requestSupabase(endpoint, options = {}) {
    const config = getSupabaseConfig();
    const response = await fetch(`${config.url}${endpoint}`, {
        method: options.method || 'GET',
        headers: {
            apikey: config.key,
            Authorization: `Bearer ${config.key}`,
            Accept: 'application/json',
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...(options.headers || {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined
    });

    const raw = await response.text();
    let payload;
    try {
        payload = raw ? JSON.parse(raw) : null;
    } catch (_) {
        payload = raw;
    }

    if (!response.ok) {
        const message = typeof payload === 'string'
            ? payload
            : (payload?.message || payload?.hint || payload?.error || `Supabase error ${response.status}`);
        const error = new Error(message);
        error.status = response.status;
        error.details = payload;
        throw error;
    }

    return payload;
}

function mapDbRow(row) {
    if (!row || typeof row !== 'object') return null;
    return {
        orderId: String(row.id || '').trim(),
        phone: String(row.phone || '').trim(),
        email: String(row.email || '').trim(),
        status: String(row.status || '').trim(),
        createdAt: String(row.created_at || '').trim(),
        updatedAt: String(row.updated_at || '').trim(),
        smsSentAt: String(row.sms_sent_at || '').trim(),
        emailSentAt: String(row.email_sent_at || '').trim(),
        paymentNotifiedAt: String(row.payment_notified_at || '').trim()
    };
}

function buildInsertPayload(order, nowIso) {
    return {
        id: String(order.orderId || '').trim(),
        phone: String(order.phone || '').trim(),
        email: String(order.email || '').trim() || null,
        status: String(order.status || 'created').trim() || 'created',
        created_at: String(order.createdAt || '').trim() || nowIso,
        updated_at: nowIso
    };
}

function buildPatchPayload(patch, nowIso) {
    const next = {
        updated_at: nowIso
    };

    if (typeof patch?.status !== 'undefined') {
        next.status = String(patch.status || '').trim();
    }
    if (typeof patch?.phone !== 'undefined') {
        next.phone = String(patch.phone || '').trim();
    }
    if (typeof patch?.email !== 'undefined') {
        next.email = String(patch.email || '').trim() || null;
    }
    if (typeof patch?.smsSentAt !== 'undefined') {
        next.sms_sent_at = String(patch.smsSentAt || '').trim() || null;
    }
    if (typeof patch?.emailSentAt !== 'undefined') {
        next.email_sent_at = String(patch.emailSentAt || '').trim() || null;
    }

    return next;
}

async function saveOrder(order) {
    const orderId = String(order?.orderId || '').trim();
    if (!orderId) {
        throw new Error('saveOrder: orderId is required');
    }

    const phone = String(order?.phone || '').trim();
    if (!phone) {
        throw new Error('saveOrder: phone is required');
    }

    const now = new Date().toISOString();
    const payload = buildInsertPayload({ ...order, orderId, phone }, now);
    const rows = await requestSupabase(
        `/rest/v1/${ORDERS_TABLE}?on_conflict=id`,
        {
            method: 'POST',
            headers: {
                Prefer: 'resolution=merge-duplicates,return=representation'
            },
            body: payload
        }
    );

    const row = Array.isArray(rows) ? rows[0] : null;
    return mapDbRow(row);
}

async function getOrderById(orderId) {
    const id = String(orderId || '').trim();
    if (!id) return null;

    const rows = await requestSupabase(
        `/rest/v1/${ORDERS_TABLE}?id=eq.${encode(id)}&select=id,phone,email,status,created_at,updated_at,sms_sent_at,email_sent_at,payment_notified_at&limit=1`
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    return mapDbRow(row);
}

async function updateOrderById(orderId, patch) {
    const id = String(orderId || '').trim();
    if (!id) return null;

    const now = new Date().toISOString();
    const body = buildPatchPayload(patch, now);
    const rows = await requestSupabase(
        `/rest/v1/${ORDERS_TABLE}?id=eq.${encode(id)}`,
        {
            method: 'PATCH',
            headers: {
                Prefer: 'return=representation'
            },
            body
        }
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    return mapDbRow(row);
}

async function claimOrderForSms(orderId) {
    const id = String(orderId || '').trim();
    if (!id) return null;

    const now = new Date().toISOString();
    const rows = await requestSupabase(
        `/rest/v1/${ORDERS_TABLE}?id=eq.${encode(id)}&sms_sent_at=is.null&sms_sending_at=is.null`,
        {
            method: 'PATCH',
            headers: {
                Prefer: 'return=representation'
            },
            body: {
                status: 'success',
                sms_sending_at: now,
                updated_at: now
            }
        }
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    return mapDbRow(row);
}

async function markSmsSent(orderId) {
    const id = String(orderId || '').trim();
    if (!id) return null;

    const now = new Date().toISOString();
    const rows = await requestSupabase(
        `/rest/v1/${ORDERS_TABLE}?id=eq.${encode(id)}`,
        {
            method: 'PATCH',
            headers: {
                Prefer: 'return=representation'
            },
            body: {
                status: 'success',
                sms_sent_at: now,
                sms_sending_at: null,
                updated_at: now
            }
        }
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    return mapDbRow(row);
}

async function releaseSmsClaim(orderId) {
    const id = String(orderId || '').trim();
    if (!id) return null;

    const now = new Date().toISOString();
    const rows = await requestSupabase(
        `/rest/v1/${ORDERS_TABLE}?id=eq.${encode(id)}&sms_sent_at=is.null`,
        {
            method: 'PATCH',
            headers: {
                Prefer: 'return=representation'
            },
            body: {
                sms_sending_at: null,
                updated_at: now
            }
        }
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    return mapDbRow(row);
}

async function claimOrderForPaymentNotification(orderId) {
    const id = String(orderId || '').trim();
    if (!id) return null;

    const now = new Date().toISOString();
    const rows = await requestSupabase(
        `/rest/v1/${ORDERS_TABLE}?id=eq.${encode(id)}&payment_notified_at=is.null&payment_notifying_at=is.null`,
        {
            method: 'PATCH',
            headers: {
                Prefer: 'return=representation'
            },
            body: {
                payment_notifying_at: now,
                updated_at: now
            }
        }
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    return mapDbRow(row);
}

async function markOrderPaymentNotified(orderId) {
    const id = String(orderId || '').trim();
    if (!id) return null;

    const now = new Date().toISOString();
    const rows = await requestSupabase(
        `/rest/v1/${ORDERS_TABLE}?id=eq.${encode(id)}`,
        {
            method: 'PATCH',
            headers: {
                Prefer: 'return=representation'
            },
            body: {
                payment_notified_at: now,
                payment_notifying_at: null,
                updated_at: now
            }
        }
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    return mapDbRow(row);
}

async function releasePaymentNotificationClaim(orderId) {
    const id = String(orderId || '').trim();
    if (!id) return null;

    const now = new Date().toISOString();
    const rows = await requestSupabase(
        `/rest/v1/${ORDERS_TABLE}?id=eq.${encode(id)}&payment_notified_at=is.null`,
        {
            method: 'PATCH',
            headers: {
                Prefer: 'return=representation'
            },
            body: {
                payment_notifying_at: null,
                updated_at: now
            }
        }
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    return mapDbRow(row);
}

module.exports = {
    saveOrder,
    getOrderById,
    updateOrderById,
    claimOrderForSms,
    markSmsSent,
    releaseSmsClaim,
    claimOrderForPaymentNotification,
    markOrderPaymentNotified,
    releasePaymentNotificationClaim
};
