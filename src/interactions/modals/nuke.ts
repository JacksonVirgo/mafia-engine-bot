import { TextInputStyle, TextInputBuilder, ActionRowBuilder } from 'discord.js';
import { Modal } from '../../structures/interactions';
export default new Modal('nuke-category', 'Nuke Category')
	.hydrate(async () => {
		return [new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('codes').setLabel('Nuclear Codes').setStyle(TextInputStyle.Short).setRequired(true))];
	})
	.onExecute(async (i, cache) => {
		if (!cache) return;
		// Fetch Category
		const nuclearCodes = i.fields.getTextInputValue('codes');

		
	});
