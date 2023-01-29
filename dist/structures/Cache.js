"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearExpiredCache = exports.getFromCache = exports.addToCache = void 0;
const discord_js_1 = require("discord.js");
const crypto_1 = require("crypto");
const cache = new discord_js_1.Collection();
function addToCache(data, expires) {
    const expiresAt = expires !== null && expires !== void 0 ? expires : new Date().getTime() + 300000; // 5 minutes from now.
    const uuid = (0, crypto_1.randomUUID)().split('_').join('');
    cache.set(uuid, { expiresAt, data, handle: uuid });
}
exports.addToCache = addToCache;
function getFromCache(handle) {
    const cachedItem = cache.get(handle);
    if (!cachedItem)
        return null;
    const { expiresAt, data } = cachedItem;
    return { expiresAt, data };
}
exports.getFromCache = getFromCache;
function clearExpiredCache() {
    let deleteList = [];
    cache.forEach((cachedItem) => {
        if (cachedItem.expiresAt < new Date().getTime()) {
            deleteList.push(cachedItem.handle);
            console.log(`[CACHE] Deleting ${cachedItem.handle}`);
        }
    });
    let deletionCount = 0;
    for (const handle of deleteList) {
        cache.delete(handle);
        deletionCount += 1;
    }
    return [deletionCount, cache.size];
}
exports.clearExpiredCache = clearExpiredCache;
//# sourceMappingURL=Cache.js.map