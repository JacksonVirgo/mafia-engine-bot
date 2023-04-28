import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { getAllWithRole } from '../../util/discordRole';
import { downloadDiscordImage, storeImage } from '../../util/fs';
import { env } from '../..';
import { sendLog } from '../../util/logger';

const data = new SlashCommandBuilder().setName('test').setDescription('TESTING');
export default newSlashCommand({
	data,
	execute: async (i) => {
		await i.deferReply();

		try {
			await i.editReply('Attempting to parse image');

			const imageURL = 'https://media.discordapp.net/attachments/980488547284951040/1100715295422812190/Screenshot_2023-04-26_at_7.29.32_pm.png?width=2240&height=1404';
			const buffer = await downloadDiscordImage(imageURL);

			const response = await storeImage(buffer);

			if (!response) await i.editReply('An error has occurred');
			else await i.editReply('Success');
		} catch (err) {
			console.log(err);
			await i.editReply('An error has occurred');
		}
	},
});
