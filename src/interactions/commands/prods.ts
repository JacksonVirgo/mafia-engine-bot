import { ChannelType, Colors, EmbedBuilder, Message, SlashCommandBuilder, TextChannel } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
const data = new SlashCommandBuilder().setName('prods').setDescription('Generate prods');
data.addRoleOption((role) => role.setName('aliveline').setDescription('Role which all living players have').setRequired(true));
data.addChannelOption((channel) => channel.setName('channel').setDescription('Channel to check prods within').addChannelTypes(ChannelType.GuildText).setRequired(true));
data.addIntegerOption((str) => str.setName('since').setDescription('Timestamp of the message you want to check prods since').setRequired(true));

export default newSlashCommand({
	data,
	execute: async (i) => {
		const aliveLine = i.options.getRole('aliveline', true);
		const channel = i.options.getChannel('channel', true) as TextChannel;
		const since = i.options.getInteger('since', true);
		if (!i.guild) return;

		await i.deferReply({ ephemeral: true });

		try {
			const prodChecks: Record<string, Message<boolean>[]> = {};
			const role = i.guild.roles.cache.get(aliveLine.id);
			if (!role) throw Error('Invalid role');
			const users = role.members.map((m) => m.user.id);
			users.forEach((user) => {
				prodChecks[user] = [];
			});

			let message = await channel.messages.fetch({ limit: 1 }).then((messagePage) => (messagePage.size === 1 ? messagePage.at(0) : null));
			while (message) {
				let hitProdThreshold = false;
				await channel.messages.fetch({ limit: 100, before: message.id }).then((messagePage) => {
					messagePage.forEach((msg) => {
						if (msg.createdTimestamp < since) hitProdThreshold = true;
						if (users.includes(msg.author.id)) {
							if (msg.createdTimestamp >= since) {
								prodChecks[msg.author.id].push(msg);
							}
						}
					});
					message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
					if (hitProdThreshold) message = null;
				});
			}

			const embed = new EmbedBuilder();
			embed.setTitle('Prod Check');
			embed.setColor(Colors.White);

			const prodded: string[] = [];
			for (const userID in prodChecks) {
				console.log(`checking ${userID}`);
				const list = prodChecks[userID];
				if (list.length < 25) prodded.push(`<@${userID}> has ${list.length}/${20} messages.`);
			}

			if (prodded.length > 0) embed.addFields({ name: 'Prodded', value: prodded.join('\n') });
			else embed.setDescription('Nobody was prodded!');

			await i.editReply({ embeds: [embed] });
		} catch (err) {
			console.log(err);
			await i.editReply('An error has occurred');
		}
	},
});
