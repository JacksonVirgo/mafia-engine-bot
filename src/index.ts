import { BotClient } from './structures/BotClient';
import * as dotenv from 'dotenv';
import { cacheTick, clearExpiredCache } from './structures/Cache';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
	DISCORD_BOT_TOKEN: z.string(),
	DISCORD_BOT_CLIENT_ID: z.string(),
	LOG_WEBHOOK: z.string(),
	IMAGE_CDN_CHANNEL_ID: z.string(),
	WEBHOOK_IMAGE_CDN: z.string(),
});

export const env = envSchema.parse(process.env);

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
