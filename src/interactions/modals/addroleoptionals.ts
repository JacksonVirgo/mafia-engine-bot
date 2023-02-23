import { TextInputStyle, TextInputBuilder, EmbedBuilder, RoleResolvable, HexColorString, ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { prisma } from '../..';
import { Modal } from '../../structures/interactions';
import { createRoleCardEmbed } from '../../util/rolecard';
import rolecardAddOptional from '../buttons/rolecardAddOptional';
import rolecardDelete from '../buttons/rolecardDelete';
import rolecardUpdateCore from '../buttons/rolecardUpdateCore';

export default new Modal('update-role-optionals', 'Add Options for Role')
	// .newInput(new TextInputBuilder().setCustomId('flavour').setLabel('Flavour').setStyle(TextInputStyle.Short).setRequired(false))
	// .newInput(new TextInputBuilder().setCustomId('wikiUrl').setLabel('Wiki URL').setStyle(TextInputStyle.Short).setRequired(false))
	// .newInput(new TextInputBuilder().setCustomId('iconUrl').setLabel('Icon URL').setStyle(TextInputStyle.Short).setRequired(false))

	.hydrate(async (modal, cache) => {
		let hydration = [];
		const existingRole = await prisma.role.findUnique({
			where: {
				id: cache,
			},
		});

		hydration.push(
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId('flavour')
					.setLabel('Flavour')
					.setStyle(TextInputStyle.Short)
					.setRequired(false)
					.setValue(existingRole?.flavourText ?? '')
			)
		);

		hydration.push(
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId('wikiUrl')
					.setLabel('Wiki URL')
					.setStyle(TextInputStyle.Short)
					.setRequired(false)
					.setValue(existingRole?.wikiUrl ?? '')
			)
		);
		hydration.push(
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId('iconUrl')
					.setLabel('Icon URL')
					.setStyle(TextInputStyle.Short)
					.setRequired(false)
					.setValue(existingRole?.iconUrl ?? '')
			)
		);

		return hydration;
	})
	.onExecute(async (i, cache) => {
		if (!cache) return;

		const flavour = i.fields.getTextInputValue('flavour');
		const wikiUrl = i.fields.getTextInputValue('wikiUrl');
		const iconUrl = i.fields.getTextInputValue('iconUrl');

		try {
			const role = await prisma.role.findFirst({
				where: {
					id: cache,
				},
			});

			if (!role) return;

			const updated = await prisma.role.update({
				where: {
					id: role.id,
				},
				data: {
					flavourText: flavour,
					wikiUrl,
					iconUrl,
				},
			});

			const embed = createRoleCardEmbed(updated);

			const row = new ActionRowBuilder<ButtonBuilder>();
			row.addComponents(rolecardAddOptional.getButton(updated.id));
			row.addComponents(rolecardUpdateCore.getButton(updated.id));
			row.addComponents(rolecardDelete.getButton(updated.id));

			await i.reply({ embeds: [embed], components: [row] });
		} catch (err) {
			await i.reply({ content: 'An error has occurred, did you input data wrong?', ephemeral: true });
		}
	});
