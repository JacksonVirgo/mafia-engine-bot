import { BotClient } from './structures/BotClient';
import { cacheTick, clearExpiredCache } from './structures/Cache';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import {config as dotenv} from 'dotenv';

dotenv();

const envSchema = z.object({
	DISCORD_BOT_TOKEN: z.string(),
	DISCORD_BOT_CLIENT_ID: z.string(),
	LOG_WEBHOOK: z.string().nullish(),
	IMAGE_CDN_CHANNEL_ID: z.string().nullish(),
	WEBHOOK_IMAGE_CDN: z.string().nullish(),
	MAIN_SERVER_ID: z.string(),
});

export const env = envSchema.parse(process.env);
export const config = {
	...envSchema.parse(process.env),
	botToken: env.DISCORD_BOT_TOKEN,
	clientID: env.DISCORD_BOT_CLIENT_ID,
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
