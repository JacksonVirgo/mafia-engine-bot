import { Collection } from 'discord.js';
import { randomUUID } from 'crypto';

interface CachedItem {
	expiresAt: number;
	data: any;
}

interface StoredCache extends CachedItem {
	handle: string;
}

const cache: Collection<string, StoredCache> = new Collection();

export function addToCache(data: any, expires: number | undefined) {
	const expiresAt = expires ?? new Date().getTime() + 300000; // 5 minutes from now.
	const uuid = randomUUID().split('_').join('');
	cache.set(uuid, { expiresAt, data, handle: uuid });
}

export function getFromCache(handle: string): CachedItem | null {
	const cachedItem = cache.get(handle);
	if (!cachedItem) return null;

	const { expiresAt, data } = cachedItem;

	return { expiresAt, data };
}

export function clearExpiredCache() {
	let deleteList: string[] = [];

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
