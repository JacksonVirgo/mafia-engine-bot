import { BotClient } from './structures/BotClient';
import * as dotenv from 'dotenv';
import { addToCache, clearExpiredCache } from './structures/Cache';
import { PrismaClient } from '@prisma/client';

dotenv.config();

export const config = {
	botToken: process.env.DISCORD_BOT_TOKEN as string,
	clientID: process.env.DISCORD_BOT_CLIENT_ID as string,
	cacheClearInterval: 5 * 1000,
};

export const prisma = new PrismaClient();
export const client = new BotClient(config.clientID, config.botToken);

(async () => {
	setInterval(() => {
		clearExpiredCache();
	}, config.cacheClearInterval);

	client.start();
})();
