import { ActionRow, ActionRowBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { prisma } from '../..';
import { newSlashCommand } from '../../structures/BotClient';
import { Modal } from '../../structures/interactions';
import { createRoleCardEmbed, getListOfRolecardNames } from '../../util/rolecard';
import { findBestMatch } from 'string-similarity';

const data = new SlashCommandBuilder().setName('roles').setDescription('View a role');
data.addStringOption((x) => x.setName('name').setDescription('Role name').setRequired(true));

export default newSlashCommand({
	data,
	execute: async (i) => {
		const update = i.options.getString('name', true);

		let role = await prisma.role.findFirst({
			where: {
				name: update,
			},
		});

		let isSpellChecked = false;

		if (!role) {
			const allRoleNames = await getListOfRolecardNames();
			const stringSimilarity = findBestMatch(update, allRoleNames);
			const target = stringSimilarity.bestMatch.target;

			role = await prisma.role.findFirst({
				where: {
					name: target,
				},
			});

			isSpellChecked = true;
		}

		if (role) {
			const embed = createRoleCardEmbed(role);
			return i.reply({ embeds: [embed], content: isSpellChecked ? `Did you mean __${role.name}__?` : undefined });
		} else {
			return i.reply({ content: 'Unknown role', ephemeral: true });
		}
	},
});
