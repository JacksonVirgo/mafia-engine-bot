import { ActionRowBuilder, channelLink, ChannelSelectMenuBuilder, ChannelType, InviteTargetType, SlashCommandBuilder, TextChannel } from 'discord.js';
import { arch } from 'os';
import { newSlashCommand } from '../../structures/BotClient';
import { safeReply } from '../../structures/interactions';
import { archiveChannel } from '../selectmenu/archive';

const data = new SlashCommandBuilder().setName('archive').setDescription('Archive a channel');
data.addChannelOption((x) => x.setName('channel').setDescription('Channel to archive').addChannelTypes(ChannelType.GuildText).setRequired(true));

export default newSlashCommand({
	data,
	execute: async (i) => {
		try {
			await i.guild.channels.fetch();
			await i.reply('Attempting to archive');
			const message = await i.channel.send('PROGRESS');

			const channel = i.options.getChannel('channel', true) as TextChannel;
			const archivedChannel = await archiveChannel(channel);
			if (archivedChannel) {
				await message.edit(`<#${channel.id}> archived`);
			} else {
				await message.edit(`<#${channel.id}> failed to archive`);
			}
		} catch (err) {
			console.log(err);
			await safeReply(i, 'No');
		}
	},
});
