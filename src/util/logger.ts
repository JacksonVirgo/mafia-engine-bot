import axios from 'axios';
import { MessagePayload, Webhook, WebhookClient, WebhookMessageCreateOptions } from 'discord.js';
import { env } from '..';

export async function sendLog(message: string | MessagePayload | WebhookMessageCreateOptions) {
	try {
		const webhookURI = env.LOG_WEBHOOK;
		const hook = new WebhookClient({ url: webhookURI });
		const response = await hook.send(message);
		return response;
	} catch (err) {
		console.log(err);
		return null;
	}
}
