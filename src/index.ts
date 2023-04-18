import { BotClient } from './structures/BotClient';
import * as dotenv from 'dotenv';
import { cacheTick, clearExpiredCache } from './structures/Cache';
import { PrismaClient } from '@prisma/client';

dotenv.config();

export const config = {
	botToken: process.env.DISCORD_BOT_TOKEN as string,
	clientID: process.env.DISCORD_BOT_CLIENT_ID as string,
	tickInterval: 1000,
};

export const prisma = new PrismaClient();
export const client = new BotClient(config.clientID, config.botToken);

(async () => {
	client.start();
	tick(client);
})();

async function tick(client: BotClient) {
	if (cacheTick()) clearExpiredCache();

	setTimeout(() => {
		tick(client);
	}, config.tickInterval);
}
