import { CategoryChannel, Channel, ChannelType, SlashCommandBuilder, TextChannel } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import NukeModal from '../modals/nuke';

const data = new SlashCommandBuilder().setName('nuke').setDescription('Delete all channels underneath a category');
data.addChannelOption((x) => x.setName('category').setDescription('Category to delete all channels under').setRequired(true).addChannelTypes(ChannelType.GuildCategory));

export default newSlashCommand({
	data,
	execute: async (i) => {
		await i.showModal(await NukeModal.getModal());
	},
});
