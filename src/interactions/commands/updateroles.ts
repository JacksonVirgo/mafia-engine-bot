import { ActionRow, ActionRowBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import newrole from '../modals/newrole';

const data = new SlashCommandBuilder().setName('updateroles').setDescription('[STAFF] Add or update a role in the database');
data.addStringOption((x) => x.setName('update').setDescription('If updating, type the name of the role').setRequired(false));

export default newSlashCommand({
	data,
	execute: async (i) => {
		const update = i.options.getString('update', false);
		if (update) {
		} else i.showModal(await newrole.getModal());
	},
});
