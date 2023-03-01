import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { Button } from '../../structures/interactions';
import newrole from '../modals/newrole';

export default new Button('rolecards-update-core').setButton(new ButtonBuilder().setLabel('Edit Core').setStyle(ButtonStyle.Secondary)).onExecute(async (i, cache) => {
	if (!cache) return i.reply({ content: 'This button is invalid', ephemeral: true });

	await i.showModal(await newrole.getModal(cache));
});
