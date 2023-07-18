import axios from 'axios';
import { AttachmentBuilder, Guild, TextBasedChannel, WebhookClient } from 'discord.js';
import { env } from '..';

let cdnChannel: TextBasedChannel | null = null;

export async function downloadDiscordImage(url: string) {
	const response = await axios.get(url, {
		responseType: 'arraybuffer',
	});
	return Buffer.from(response.data, 'base64');
}

export async function getCDNChannel(guild?: Guild): Promise<TextBasedChannel | null> {
	if (cdnChannel) return cdnChannel;
	if (!guild) return null;

	await guild.channels.fetch();
	const channel = guild.channels.cache.get(env.IMAGE_CDN_CHANNEL_ID);
	if (!channel) return null;

	if (channel.isTextBased()) {
		cdnChannel = channel;
		return channel;
	}

	return null;
}

export async function storeImage(buffer: Buffer) {
	const builder = new AttachmentBuilder(buffer);
	builder.setName('archived_image.png');

	const hook = new WebhookClient({ url: env.WEBHOOK_IMAGE_CDN });

	const message = await hook.send({
		content: 'This should have a file attached',
		files: [builder],
	});

	return message;
}
