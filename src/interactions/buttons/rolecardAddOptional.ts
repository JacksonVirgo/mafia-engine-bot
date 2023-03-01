import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { Button } from '../../structures/interactions';
import addroleoptionals from '../modals/addroleoptionals';

export default new Button('rolecards-update-optionals').setButton(new ButtonBuilder().setLabel('Edit Optionals').setStyle(ButtonStyle.Secondary)).onExecute(async (i, cache) => {
	if (!cache) return i.reply({ content: 'This button is invalid', ephemeral: true });
	await i.showModal(await addroleoptionals.getModal(cache));
});
