import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { prisma } from '../..';
import { Button } from '../../structures/interactions';

export default new Button('rolecards-delete').setButton(new ButtonBuilder().setLabel('Delete').setStyle(ButtonStyle.Danger)).onExecute(async (i, cache) => {
	if (!cache) return i.reply({ content: 'This button is invalid', ephemeral: true });

	const roleExists = await prisma.role.findFirst({
		where: {
			id: cache,
		},
	});

	if (!roleExists) return;

	const deleted = await prisma.role.delete({
		where: {
			id: roleExists.id,
		},
	});

	await i.reply(`Role should be deleted`);
});
