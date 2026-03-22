const crypto = require('crypto');

const ORDER_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const KYIV_TIMEZONE = 'Europe/Kyiv';

function generateOrderId() {
    let letters = '';
    for (let i = 0; i < 5; i += 1) {
        letters += ORDER_LETTERS[crypto.randomInt(0, ORDER_LETTERS.length)];
    }

    let digits = '';
    for (let i = 0; i < 2; i += 1) {
        digits += String(crypto.randomInt(0, 10));
    }

    return `${letters}${digits}`;
}

function parseOrderItems(items) {
    if (!Array.isArray(items)) return [];
    return items
        .map((item) => ({
            title: String(item?.title || '').trim(),
            category: String(item?.category || '').trim(),
            size: String(item?.size || '').trim(),
            price: Number(item?.price || 0),
            quantity: Number(item?.quantity || 0)
        }))
        .filter((item) => item.title && Number.isFinite(item.quantity) && item.quantity > 0)
        .map((item) => ({
            ...item,
            quantity: Math.max(1, Math.floor(item.quantity)),
            price: Number.isFinite(item.price) ? item.price : 0
        }));
}

function parseOrderPayload(body) {
    const items = parseOrderItems(body?.items);
    const total = Number(body?.total || 0);

    return {
        name: String(body?.name || '').trim(),
        shipping: String(body?.shipping || '').trim(),
        phone: String(body?.phone || '').trim(),
        comment: String(body?.comment || '').trim(),
        items,
        total: Number.isFinite(total) ? total : 0,
        paymentMethod: String(body?.paymentMethod || '').trim()
    };
}

function formatCurrency(value) {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount)) return '0 UAH';
    return `${Math.round(amount)} UAH`;
}

function mapPaymentMethodLabel(method) {
    const normalized = String(method || '').trim().toLowerCase();
    if (normalized === 'invoice') return 'Bank details';
    if (normalized === 'wallet') return 'Google Pay / Apple Pay (LiqPay)';
    if (normalized === 'liqpay') return 'LiqPay';
    return method || 'Not specified';
}

function formatCreatedItems(items) {
    if (!Array.isArray(items) || !items.length) return '-';

    const maxItems = 18;
    const lines = items.slice(0, maxItems).map((item, index) => {
        const sizePart = item.size ? `, ${item.size}` : '';
        const categoryPart = item.category ? ` (${item.category})` : '';
        const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);
        return `${index + 1}. ${item.title}${categoryPart}${sizePart} x${item.quantity} = ${formatCurrency(lineTotal)}`;
    });

    if (items.length > maxItems) {
        lines.push(`...and ${items.length - maxItems} more items`);
    }

    return lines.join('\n');
}

function formatKyivTime(timestampValue) {
    const timestamp = Number(timestampValue);
    if (!Number.isFinite(timestamp) || timestamp <= 0) return null;

    const millis = timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp;
    const date = new Date(millis);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat('uk-UA', {
        timeZone: KYIV_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(date);
}

function buildCreatedOrderMessage(order) {
    const itemsText = formatCreatedItems(order.items);
    const lines = [
        'NEW ORDER',
        `Order number: ${order.orderId}`,
        `Name: ${order.name || 'Not specified'}`,
        `Phone: ${order.phone || 'Not specified'}`,
        `Shipping: ${order.shipping || 'Not specified'}`,
        `Items:\n${itemsText}`,
        `Total: ${formatCurrency(order.total)}`,
        `Payment method: ${mapPaymentMethodLabel(order.paymentMethod)}`,
        'Status: created'
    ];

    if (order.comment) {
        lines.push(`Comment: ${order.comment}`);
    }

    return lines.join('\n');
}

function buildPaidOrderMessage(payload) {
    const paidAt = formatKyivTime(payload?.end_date || payload?.create_date || payload?.transaction_id_date);
    const receiptLink = String(
        payload?.receipt_url
        || payload?.public_url
        || payload?.payment_link
        || payload?.checkout_url
        || payload?.url
        || ''
    ).trim();

    const lines = [
        'PAYMENT CONFIRMED',
        `Order number: ${String(payload?.order_id || '').trim() || 'Not specified'}`,
        `Total: ${formatCurrency(payload?.amount)}`,
        'Status: paid',
        `Paid at: ${paidAt || 'Not provided in callback'}`,
        `Transaction ID: ${String(payload?.transaction_id || '').trim() || 'Not provided'}`,
        `Order ID (LiqPay): ${String(payload?.order_id || '').trim() || 'Not provided'}`,
        `Receipt / link: ${receiptLink || 'Not provided'}`
    ];

    return lines.join('\n');
}

module.exports = {
    generateOrderId,
    parseOrderPayload,
    buildCreatedOrderMessage,
    buildPaidOrderMessage,
    formatCurrency
};
