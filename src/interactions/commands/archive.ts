import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, InviteTargetType, SlashCommandBuilder, TextChannel } from 'discord.js';
import { arch } from 'os';
import { newSlashCommand } from '../../structures/BotClient';
import archive from '../selectmenu/archive';

const data = new SlashCommandBuilder().setName('archive').setDescription('Archive a channel');

data.addStringOption((x) =>
	x
		.setName('queue')
		.setDescription('What queue is this game running under?')
		.addChoices(
			{
				name: 'Main',
				value: 'ma',
			},
			{
				name: 'Special',
				value: 'sp',
			},
			{
				name: 'Newcomer',
				value: 'ne',
			},
			{
				name: 'Community',
				value: 'co',
			}
		)
		.setRequired(true)
).addIntegerOption((x) => x.setName('number').setDescription('What number game is it in the queue').setRequired(true));

export default newSlashCommand({
	data,
	execute: async (i) => {
		const queue = i.options.getString('queue', true);
		const queueIndex = i.options.getInteger('number', true);

		const gameTag = queue + queueIndex;
		const archiveID = archive.createCustomID(gameTag);
		console.log(archiveID);
		const row = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(new ChannelSelectMenuBuilder().addChannelTypes(ChannelType.GuildText).setCustomId(archiveID).setMinValues(1).setMaxValues(20));
		await i.reply({ components: [row] });
	},
});
