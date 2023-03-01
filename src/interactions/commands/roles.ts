import { ActionRow, ActionRowBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { prisma } from '../..';
import { newSlashCommand } from '../../structures/BotClient';
import { Modal } from '../../structures/interactions';
import { createRoleCardEmbed, getListOfRolecardNames } from '../../util/rolecard';
import { findBestMatch } from 'string-similarity';

const data = new SlashCommandBuilder().setName('roles').setDescription('View a role');
data.addStringOption((x) => x.setName('name').setDescription('Role name').setRequired(true));

export function correctSpelling(name: string, allRoleNames: string[]) {
	try {
		if (allRoleNames.length === 1) return allRoleNames[0];
		const similarity = findBestMatch(name, allRoleNames);
		const target = similarity.bestMatch.target;
		return target;
	} catch (err) {
		return null;
	}
}

export default newSlashCommand({
	data,
	execute: async (i) => {
		const update = i.options.getString('name', true);

		let role = await prisma.role.findFirst({
			where: {
				name: {
					mode: 'insensitive',
					equals: update,
				},
			},
		});

		let isSpellChecked = false;

		if (!role) {
			const allRoleNames = await getListOfRolecardNames();
			const target = correctSpelling(update, allRoleNames);
			if (!target) return i.reply({ content: 'Unable to find a matching role', ephemeral: true });

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
