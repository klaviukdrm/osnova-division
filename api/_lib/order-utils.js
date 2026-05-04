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
            source: String(item?.source || '').trim().toLowerCase(),
            size: String(item?.size || '').trim(),
            price: Number(item?.price || 0),
            quantity: Number(item?.quantity || 0),
            image: String(item?.image || '').trim(),
            customKey: String(item?.customKey || '').trim(),
            sourceImages: Array.isArray(item?.sourceImages)
                ? item.sourceImages.map((value) => String(value || '').trim()).filter(Boolean)
                : []
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
        city: String(body?.city || '').trim(),
        shipping: String(body?.shipping || '').trim(),
        phone: String(body?.phone || '').trim(),
        comment: String(body?.comment || '').trim(),
        receiptImage: String(body?.receiptImage || '').trim(),
        receiptName: String(body?.receiptName || '').trim(),
        items,
        total: Number.isFinite(total) ? total : 0,
        paymentMethod: String(body?.paymentMethod || '').trim()
    };
}

function formatCurrency(value) {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount)) return `0\u20B4`;
    return `${Math.round(amount)}\u20B4`;
}

function mapPaymentMethodLabel(method) {
    const normalized = String(method || '').trim().toLowerCase();
    if (normalized === 'invoice') return '\u041e\u043f\u043b\u0430\u0442\u0430 \u0437\u0430 \u0440\u0435\u043a\u0432\u0456\u0437\u0438\u0442\u0430\u043c\u0438';
    if (normalized === 'wallet') return 'Google Pay / Apple Pay (LiqPay)';
    if (normalized === 'liqpay') return 'LiqPay';
    return method || '\u041d\u0435 \u0432\u043a\u0430\u0437\u0430\u043d\u043e';
}

function formatCreatedItems(items) {
    if (!Array.isArray(items) || !items.length) return '\u2014';

    const maxItems = 18;
    const lines = items.slice(0, maxItems).map((item, index) => {
        const sizePart = item.size ? ` (${item.size})` : '';
        const qtyPart = item.quantity > 1 ? ` x${item.quantity}` : '';
        const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);
        return `${index + 1}. ${item.title}${sizePart}${qtyPart} \u2014 ${formatCurrency(lineTotal)}`;
    });

    if (items.length > maxItems) {
        lines.push(`...\u0449\u0435 ${items.length - maxItems} \u043f\u043e\u0437\u0438\u0446\u0456\u0439`);
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
        '\uD83D\uDC80 \u041d\u041e\u0412\u0415 \u0417\u0410\u041c\u041e\u0412\u041b\u0415\u041d\u041d\u042f \uD83D\uDC80',
        '',
        `\uD83C\uDD94 \u041d\u043e\u043c\u0435\u0440: ${order.orderId}`,
        `\uD83D\uDC64 \u041f\u0406\u0411: ${order.name || '\u041d\u0435 \u0432\u043a\u0430\u0437\u0430\u043d\u043e'}`,
        `\uD83D\uDCDE \u0422\u0435\u043b: ${order.phone || '\u041d\u0435 \u0432\u043a\u0430\u0437\u0430\u043d\u043e'}`,
        `\uD83C\uDFD9\uFE0F \u041c\u0456\u0441\u0442\u043e: ${order.city || '\u041d\u0435 \u0432\u043a\u0430\u0437\u0430\u043d\u043e'}`,
        `\uD83D\uDCE6 \u0414\u043e\u0441\u0442\u0430\u0432\u043a\u0430: ${order.shipping || '\u041d\u0435 \u0432\u043a\u0430\u0437\u0430\u043d\u043e'}`,
        '',
        `\uD83D\uDED2\uFE0F \u0422\u043e\u0432\u0430\u0440\u0438:\n${itemsText}`,
        `\uD83D\uDCB3 \u041e\u043f\u043b\u0430\u0442\u0430: ${mapPaymentMethodLabel(order.paymentMethod)}`,
        '\uD83D\uDCCC \u0421\u0442\u0430\u0442\u0443\u0441: created',
        `\uD83D\uDCB0 \u0421\u0423\u041c\u0410: ${formatCurrency(order.total)}`
    ];

    if (order.comment) {
        lines.push(`\uD83D\uDCDD \u041a\u043e\u043c\u0435\u043d\u0442\u0430\u0440: ${order.comment}`);
    }
    if (order.receiptImage) {
        lines.push('\uD83E\uDDFE \u041a\u0432\u0438\u0442\u0430\u043d\u0446\u0456\u044f: \u0434\u043e\u0434\u0430\u043d\u043e');
    }

    return lines.join('\n');
}

function buildInvoiceOrderMessage(order) {
    const itemsText = formatCreatedItems(order.items);
    const lines = [
        `\uD83D\uDC80 \u041d\u041e\u0412\u0415 \u0417\u0410\u041c\u041e\u0412\u041b\u0415\u041d\u041d\u042f ${order.orderId} \uD83D\uDC80`,
        '',
        `\uD83D\uDC64 \u041f\u0406\u0411: ${order.name || '\u041d\u0435 \u0432\u043a\u0430\u0437\u0430\u043d\u043e'}`,
        `\uD83D\uDCDE \u0422\u0435\u043b: ${order.phone || '\u041d\u0435 \u0432\u043a\u0430\u0437\u0430\u043d\u043e'}`,
        `\uD83C\uDFD9\uFE0F \u041c\u0456\u0441\u0442\u043e: ${order.city || '\u041d\u0435 \u0432\u043a\u0430\u0437\u0430\u043d\u043e'}`,
        `\uD83D\uDCE6 \u041d\u041f: ${order.shipping || '\u041d\u0435 \u0432\u043a\u0430\u0437\u0430\u043d\u043e'}`,
        '',
        itemsText,
        `\uD83D\uDCB0 \u0421\u0423\u041c\u0410: ${formatCurrency(order.total)}`,
        '\uD83D\uDCB3 \u041E\u041F\u041B\u0410\u0422\u0410 \u041F\u041E \u0420\u0415\u041A\u0412\u0406\u0417\u0418\u0422\u0410\u041C'
    ];

    if (order.comment) {
        lines.push(`\uD83D\uDCDD \u041a\u043e\u043c\u0435\u043d\u0442\u0430\u0440: ${order.comment}`);
    }

    return lines.join('\n');
}

function buildPaidOrderMessage(payload) {
    const paidAt = formatKyivTime(payload?.end_date || payload?.create_date || payload?.transaction_id_date);
    const paymentId = String(payload?.payment_id || '').trim();
    const transactionId = String(payload?.transaction_id || '').trim();

    const lines = [
        '\u2705 \u041e\u041f\u041b\u0410\u0422\u0423 \u041f\u0406\u0414\u0422\u0412\u0415\u0420\u0414\u0416\u0415\u041d\u041e',
        '',
        `\uD83C\uDD94 \u041d\u043e\u043c\u0435\u0440: ${String(payload?.order_id || '').trim() || '\u041d\u0435 \u0432\u043a\u0430\u0437\u0430\u043d\u043e'}`,
        `\uD83D\uDCB0 \u0421\u0443\u043c\u0430: ${formatCurrency(payload?.amount)}`,
        '\uD83D\uDCCC \u0421\u0442\u0430\u0442\u0443\u0441: paid',
        `\uD83D\uDD52 \u0427\u0430\u0441 \u043e\u043f\u043b\u0430\u0442\u0438: ${paidAt || '\u041d\u0435\u043c\u0430\u0454 \u0432 callback'}`,
        `\uD83D\uDD17 Transaction ID: ${transactionId || '\u041d\u0435\u043c\u0430\u0454'}`,
        `\uD83C\uDD94 Payment ID: ${paymentId || '\u041d\u0435\u043c\u0430\u0454'}`,
        `\uD83D\uDD0E Order ID (LiqPay): ${String(payload?.order_id || '').trim() || '\u041d\u0435\u043c\u0430\u0454'}`
    ];

    return lines.join('\n');
}

function isDataBase64Url(value) {
    return /^data:[^;,]+(?:;[^,]*)?;base64,/i.test(String(value || '').trim());
}

function isHttpUrl(value) {
    return /^https?:\/\//i.test(String(value || '').trim());
}

function isMediaReference(value) {
    const normalizedValue = String(value || '').trim();
    if (!normalizedValue) return false;
    return isDataBase64Url(normalizedValue) || isHttpUrl(normalizedValue);
}

function resolveSafeLimit(limit, fallbackValue = Number.POSITIVE_INFINITY) {
    const resolvedLimit = Number(limit);
    if (!Number.isFinite(resolvedLimit)) return fallbackValue;
    return Math.max(1, Math.floor(resolvedLimit));
}

function isConstructorItem(item) {
    const category = String(item?.category || '').toLowerCase();
    const customKey = String(item?.customKey || '').trim();
    return category.includes('\u043a\u043e\u043d\u0441\u0442\u0440\u0443\u043a\u0442') || Boolean(customKey);
}

function isAdminCatalogItem(item) {
    return String(item?.source || '').trim().toLowerCase() === 'api';
}

function extractCustomPreviewItems(items, limit = Number.POSITIVE_INFINITY) {
    const safeLimit = resolveSafeLimit(limit);
    const previewItems = (Array.isArray(items) ? items : [])
        .filter((item) => isConstructorItem(item))
        .filter((item) => {
            const image = String(item?.image || '').trim();
            return isMediaReference(image);
        })
        .map((item) => ({
            title: String(item?.title || '\u041a\u0430\u0441\u0442\u043e\u043c\u043d\u0438\u0439 \u0432\u0438\u0440\u0456\u0431').trim() || '\u041a\u0430\u0441\u0442\u043e\u043c\u043d\u0438\u0439 \u0432\u0438\u0440\u0456\u0431',
            image: String(item?.image || '').trim()
        }));

    return Number.isFinite(safeLimit) ? previewItems.slice(0, safeLimit) : previewItems;
}

function extractCustomSourceImages(items, limit = Number.POSITIVE_INFINITY) {
    const safeLimit = resolveSafeLimit(limit);
    const list = [];

    (Array.isArray(items) ? items : [])
        .filter((item) => isConstructorItem(item))
        .forEach((item) => {
            const sourceImages = Array.isArray(item?.sourceImages) ? item.sourceImages : [];
            sourceImages.forEach((image) => {
                const value = String(image || '').trim();
                if (!value) return;
                if (!isMediaReference(value)) return;
                list.push(value);
            });
        });

    return Number.isFinite(safeLimit) ? list.slice(0, safeLimit) : list;
}

function extractAdminPreviewItems(items, limit = Number.POSITIVE_INFINITY) {
    const safeLimit = resolveSafeLimit(limit);
    const previewItems = (Array.isArray(items) ? items : [])
        .filter((item) => isAdminCatalogItem(item))
        .filter((item) => {
            const image = String(item?.image || '').trim();
            return isMediaReference(image);
        })
        .map((item) => ({
            title: String(item?.title || '\u0410\u0434\u043c\u0456\u043d \u0442\u043e\u0432\u0430\u0440').trim() || '\u0410\u0434\u043c\u0456\u043d \u0442\u043e\u0432\u0430\u0440',
            image: String(item?.image || '').trim()
        }));

    return Number.isFinite(safeLimit) ? previewItems.slice(0, safeLimit) : previewItems;
}

module.exports = {
    generateOrderId,
    parseOrderPayload,
    buildCreatedOrderMessage,
    buildInvoiceOrderMessage,
    buildPaidOrderMessage,
    formatCurrency,
    extractCustomPreviewItems,
    extractCustomSourceImages,
    extractAdminPreviewItems
};
