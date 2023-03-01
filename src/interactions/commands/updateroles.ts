import { ActionRow, ActionRowBuilder, ButtonBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { createRoleCardEmbed, getRole } from '../../util/rolecard';
import rolecardAddOptional from '../buttons/rolecardAddOptional';
import rolecardDelete from '../buttons/rolecardDelete';
import rolecardUpdateCore from '../buttons/rolecardUpdateCore';
import newrole from '../modals/newrole';

const data = new SlashCommandBuilder().setName('updateroles').setDescription('[STAFF] Add or update a role in the database');
data.addStringOption((x) => x.setName('update').setDescription('If updating, type the name of the role').setRequired(false));

export default newSlashCommand({
	data,
	execute: async (i) => {
		const update = i.options.getString('update', false);
		if (update) {
			const role = await getRole(update);
			const embed = createRoleCardEmbed(role);

			const row = new ActionRowBuilder<ButtonBuilder>();
			row.addComponents(rolecardAddOptional.getButton(role.id));
			row.addComponents(rolecardUpdateCore.getButton(role.id));
			row.addComponents(rolecardDelete.getButton(role.id));

			await i.reply({ embeds: [embed], components: [row] });
		} else i.showModal(await newrole.getModal());
	},
});
