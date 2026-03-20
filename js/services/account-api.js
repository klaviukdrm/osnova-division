function toNumber(value, fallback = 0) {
    const normalized = Number(value);
    return Number.isFinite(normalized) ? normalized : fallback;
}

function toAbsoluteUrl(path) {
    try {
        return new URL(path, window.location.origin).toString();
    } catch (error) {
        return path || '';
    }
}

export function slugifyProduct(item) {
    const source = `${item?.category || ''}-${item?.title || ''}`
        .trim()
        .toLowerCase();

    return source
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\u0400-\u04ff]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
}

export function getProductImage(item) {
    if (!item) return '';
    if (item.image) return toAbsoluteUrl(item.image);
    if (window.Catalog?.getPrimaryImage) return toAbsoluteUrl(window.Catalog.getPrimaryImage(item));

    if (Array.isArray(item.gallery) && item.gallery.length) {
        const firstImage = item.gallery[0];
        return typeof firstImage === 'string' ? toAbsoluteUrl(firstImage) : '';
    }

    return '';
}

export function buildProductSnapshot(item) {
    return {
        product_slug: slugifyProduct(item),
        product_title: item?.title || 'Товар',
        product_category: item?.category || '',
        product_price: toNumber(item?.price, 0),
        product_image_url: getProductImage(item),
        product_url: new URL('/index.html#products', window.location.origin).toString()
    };
}

export function formatCurrency(value, currency = 'UAH') {
    return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
    }).format(toNumber(value, 0));
}

export function formatOrderDate(value) {
    if (!value) return '—';

    return new Intl.DateTimeFormat('uk-UA', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(value));
}

export function getStatusLabel(status) {
    const labels = {
        new: 'Нове',
        processing: 'В обробці',
        completed: 'Завершене',
        cancelled: 'Скасоване'
    };

    return labels[status] || status || 'Нове';
}

export async function fetchProfile(client, userId) {
    const { data, error } = await client
        .from('profiles')
        .select('id, email, full_name, phone, city, avatar_url, created_at, updated_at')
        .eq('id', userId)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function upsertProfile(client, user, payload) {
    const nextProfile = {
        id: user.id,
        email: user.email,
        full_name: payload.full_name || null,
        phone: payload.phone || null,
        city: payload.city || null,
        avatar_url: payload.avatar_url || null
    };

    const { data, error } = await client
        .from('profiles')
        .upsert(nextProfile, {
            onConflict: 'id'
        })
        .select('id, email, full_name, phone, city, avatar_url, created_at, updated_at')
        .single();

    if (error) throw error;
    return data;
}

export async function fetchOrders(client, userId) {
    const { data, error } = await client
        .from('orders')
        .select(`
            id,
            status,
            total_amount,
            currency,
            contact_name,
            contact_phone,
            comment,
            created_at,
            updated_at,
            order_items (
                id,
                product_slug,
                product_title,
                product_category,
                product_image_url,
                unit_price,
                quantity,
                line_total
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function fetchFavorites(client, userId) {
    const { data, error } = await client
        .from('favorites')
        .select('id, user_id, product_slug, product_title, product_category, product_price, product_image_url, product_url, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function addFavorite(client, userId, item) {
    const snapshot = buildProductSnapshot(item);

    const { data, error } = await client
        .from('favorites')
        .upsert({
            user_id: userId,
            ...snapshot
        }, {
            onConflict: 'user_id,product_slug'
        })
        .select('id, user_id, product_slug, product_title, product_category, product_price, product_image_url, product_url, created_at')
        .single();

    if (error) throw error;
    return data;
}

export async function removeFavorite(client, userId, productSlug) {
    const { error } = await client
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('product_slug', productSlug);

    if (error) throw error;
}

export async function createOrderFromCatalogItem(client, user, payload) {
    const quantity = Math.max(1, toNumber(payload.quantity, 1));
    const snapshot = buildProductSnapshot(payload.item);
    const totalAmount = toNumber(snapshot.product_price, 0) * quantity;

    const { data: order, error: orderError } = await client
        .from('orders')
        .insert({
            user_id: user.id,
            status: 'new',
            contact_name: payload.contact_name,
            contact_phone: payload.contact_phone,
            comment: payload.comment || null,
            total_amount: totalAmount,
            currency: 'UAH'
        })
        .select('id, user_id, status, total_amount, currency, contact_name, contact_phone, comment, created_at')
        .single();

    if (orderError) throw orderError;

    const { error: itemError } = await client
        .from('order_items')
        .insert({
            order_id: order.id,
            product_slug: snapshot.product_slug,
            product_title: snapshot.product_title,
            product_category: snapshot.product_category,
            product_image_url: snapshot.product_image_url,
            unit_price: snapshot.product_price,
            quantity
        });

    if (itemError) {
        await client.from('orders').delete().eq('id', order.id);
        throw itemError;
    }

    return order;
}