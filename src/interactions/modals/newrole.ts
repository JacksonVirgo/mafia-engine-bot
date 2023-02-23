import { TextInputStyle, TextInputBuilder, EmbedBuilder, RoleResolvable, HexColorString, ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { prisma } from '../..';
import { Modal } from '../../structures/interactions';
import { createRoleCardEmbed } from '../../util/rolecard';
import rolecardAddOptional from '../buttons/rolecardAddOptional';
import rolecardDelete from '../buttons/rolecardDelete';
import rolecardUpdateCore from '../buttons/rolecardUpdateCore';

export default new Modal('new-role-modal', 'New Role')
	// .newInput(new TextInputBuilder().setCustomId('name').setLabel('Name').setStyle(TextInputStyle.Short).setRequired(true).setPlaceholder('Mayor'))
	// .newInput(new TextInputBuilder().setCustomId('colour').setLabel('Colour (6-digit hex)').setStyle(TextInputStyle.Short).setRequired(true).setPlaceholder('#00BF00'))
	// .newInput(new TextInputBuilder().setCustomId('alignment').setLabel('Alignment + Sub Alignment').setStyle(TextInputStyle.Short).setRequired(true).setPlaceholder('Town Power'))
	// .newInput(new TextInputBuilder().setCustomId('abilities').setLabel('Abilities').setStyle(TextInputStyle.Paragraph).setRequired(true))
	// .newInput(new TextInputBuilder().setCustomId('wincon').setLabel('Win Condition').setStyle(TextInputStyle.Short).setRequired(true).setPlaceholder('Kill all evildoers while keeping at least one Town member alive'))

	.hydrate(async (modal, cache) => {
		let hydration = [];

		const existingRole = !cache
			? undefined
			: await prisma.role.findUnique({
					where: {
						id: cache,
					},
			  });

		if (existingRole && existingRole.id === cache) {
			const { name, roleColour, alignment, abilities, winCondition } = existingRole;
			hydration.push(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('name').setLabel('Name').setStyle(TextInputStyle.Short).setRequired(true).setPlaceholder('Mayor').setValue(name)));
			hydration.push(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('colour').setLabel('Colour (6-digit hex)').setStyle(TextInputStyle.Short).setRequired(true).setPlaceholder('#00BF00').setValue(roleColour)));
			hydration.push(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('alignment').setLabel('Alignment + Sub Alignment').setStyle(TextInputStyle.Short).setRequired(true).setPlaceholder('Town Power').setValue(alignment)));
			hydration.push(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('abilities').setLabel('Abilities').setStyle(TextInputStyle.Paragraph).setRequired(true).setValue(abilities)));
			hydration.push(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('wincon').setLabel('Win Condition').setStyle(TextInputStyle.Short).setRequired(true).setPlaceholder('Kill all evildoers while keeping at least one Town member alive').setValue(winCondition)));

			return hydration;
		}

		hydration.push(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('name').setLabel('Name').setStyle(TextInputStyle.Short).setRequired(true).setPlaceholder('Mayor')));
		hydration.push(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('colour').setLabel('Colour (6-digit hex)').setStyle(TextInputStyle.Short).setRequired(true).setPlaceholder('#00BF00')));
		hydration.push(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('alignment').setLabel('Alignment + Sub Alignment').setStyle(TextInputStyle.Short).setRequired(true).setPlaceholder('Town Power')));
		hydration.push(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('abilities').setLabel('Abilities').setStyle(TextInputStyle.Paragraph).setRequired(true)));
		hydration.push(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('wincon').setLabel('Win Condition').setStyle(TextInputStyle.Short).setRequired(true).setPlaceholder('Kill all evildoers while keeping at least one Town member alive')));

		return hydration;
	})
	.onExecute(async (i, cache) => {
		const name = i.fields.getTextInputValue('name');
		const roleColour = i.fields.getTextInputValue('colour');
		const alignment = i.fields.getTextInputValue('alignment');
		const abilities = i.fields.getTextInputValue('abilities');
		const winCondition = i.fields.getTextInputValue('wincon');

		let existingRole;
		if (cache)
			existingRole = await prisma.role.findUnique({
				where: {
					id: cache,
				},
			});

		if (cache && !existingRole) {
			await i.reply({ content: 'An error occurred trying to fetch the role', ephemeral: true });
		}

		try {
			if (existingRole) {
				existingRole = await prisma.role.update({
					where: {
						id: existingRole.id,
					},
					data: {
						name,
						roleColour,
						abilities,
						alignment,
						winCondition,
					},
				});
			} else {
				existingRole = await prisma.role.create({
					data: {
						name,
						roleColour,
						abilities,
						alignment,
						winCondition,
					},
				});
			}

			if (!existingRole) throw Error();

			const embed = createRoleCardEmbed(existingRole);

			const row = new ActionRowBuilder<ButtonBuilder>();
			row.addComponents(rolecardAddOptional.getButton(existingRole.id));
			row.addComponents(rolecardUpdateCore.getButton(existingRole.id));
			row.addComponents(rolecardDelete.getButton(existingRole.id));

			await i.reply({ embeds: [embed], components: [row] });
		} catch (err) {
			await i.reply({ content: 'An error has occurred, did you input data wrong?', ephemeral: true });
		}
	});
