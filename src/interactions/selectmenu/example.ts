import { SelectMenu } from '../../structures/interactions';

export default new SelectMenu('example-select').onExecute(async (i, cache) => {
	if (!i.isUserSelectMenu()) return i.reply('Not user select menu');
	await i.reply('Example Select Menu');
});
