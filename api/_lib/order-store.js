const fs = require('fs/promises');
const path = require('path');
const os = require('os');

const STORE_DIR = process.env.ORDER_STORE_DIR || os.tmpdir();
const STORE_FILE = path.join(STORE_DIR, 'upf-orders-store.json');

async function ensureStoreDir() {
    await fs.mkdir(STORE_DIR, { recursive: true });
}

async function readStore() {
    try {
        const raw = await fs.readFile(STORE_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
        if (error && error.code === 'ENOENT') return {};
        throw error;
    }
}

async function writeStore(store) {
    await ensureStoreDir();
    await fs.writeFile(STORE_FILE, JSON.stringify(store), 'utf8');
}

async function saveOrder(order) {
    const orderId = String(order?.orderId || '').trim();
    if (!orderId) {
        throw new Error('saveOrder: orderId is required');
    }

    const store = await readStore();
    const now = new Date().toISOString();
    const existing = store[orderId] && typeof store[orderId] === 'object' ? store[orderId] : null;

    const nextOrder = {
        ...(existing || {}),
        ...order,
        orderId,
        updatedAt: now,
        createdAt: existing?.createdAt || now
    };

    store[orderId] = nextOrder;
    await writeStore(store);
    return nextOrder;
}

async function getOrderById(orderId) {
    const id = String(orderId || '').trim();
    if (!id) return null;
    const store = await readStore();
    const order = store[id];
    if (!order || typeof order !== 'object') return null;
    return order;
}

async function updateOrderById(orderId, patch) {
    const id = String(orderId || '').trim();
    if (!id) return null;
    const existing = await getOrderById(id);
    if (!existing) return null;
    return saveOrder({
        ...existing,
        ...(patch && typeof patch === 'object' ? patch : {}),
        orderId: id
    });
}

module.exports = {
    saveOrder,
    getOrderById,
    updateOrderById
};
