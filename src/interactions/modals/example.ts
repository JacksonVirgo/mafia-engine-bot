import { ActionRowBuilder, TextInputBuilder } from '@discordjs/builders';
import { ModalBuilder, TextInputStyle } from 'discord.js';
import { Modal } from '../../structures/interactions';

const modal = new ModalBuilder();
modal.setTitle('Example Modal');

const exampleRow = new ActionRowBuilder<TextInputBuilder>();
exampleRow.addComponents(new TextInputBuilder().setCustomId('example-param').setLabel('Example').setStyle(TextInputStyle.Paragraph).setRequired(true));

modal.setComponents(exampleRow);

export default new Modal('example-modal', modal).onExecute((i, cache) => {
	console.log('Modal');
	const result = i.fields.getTextInputValue('example-param');
	i.reply(result);
});
