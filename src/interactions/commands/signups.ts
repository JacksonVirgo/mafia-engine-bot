import { Signup } from '@prisma/client';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, Guild, SlashCommandBuilder } from 'discord.js';
import { prisma } from '../..';
import { newSlashCommand } from '../../structures/BotClient';
import signupsBackup from '../buttons/signupsBackup';
import signupsJoin from '../buttons/signupsJoin';
import signupsRemove from '../buttons/signupsRemove';
import { sign } from 'crypto';

const data = new SlashCommandBuilder().setName('signups').setDescription('Create a signups LFG post');
data.addStringOption((title) => title.setName('title').setDescription('Title for the signup').setRequired(false));
data.addIntegerOption((limit) => limit.setName('limit').setDescription('Limit the number of signups').setRequired(false));

export default newSlashCommand({
	data,
	execute: async (i) => {
		await i.deferReply();

		const title = i.options.getString('title') ?? undefined;
		const limit = i.options.getInteger('limit') ?? undefined;

		const signup = await prisma.signup.create({
			data: {
				name: title,
				limit,
			},
		});

		if (!signup) return await i.editReply({ content: 'Unable to create a signup' });
		const { row, embed } = await createSignupPost(signup, i.guild);
		await i.editReply({ embeds: [embed], components: [row] });
	},
});

interface SignupPost {
	row: ActionRowBuilder<ButtonBuilder>;
	embed: EmbedBuilder;
}

type FormatSignupOptions = {
	isLocked?: boolean;
	useTags?: boolean;
};
export async function createSignupPost(signup: Signup, guild: Guild | null, options: FormatSignupOptions = {}): Promise<SignupPost> {
	const title = signup.name ?? 'Discord Mafia Signups';
	const limit = signup.limit;

	const { players, backups } = signup;
	let playerCounter = `${players.length}${limit ? `/${limit}` : ''}`;
	let backupCounter = `${backups.length}`;

	if (guild) {
		await guild.members.fetch();
	}

	const getList = (list: string[]) => {
		let value = '';
		for (let i = 0; i < list.length; i++) {
			const storedUser = list[i];
			const user = guild ? guild.members.cache.get(storedUser) : null;

			if (!user || options.useTags) value += `> 1. <@${storedUser}>\n`;
			else value += `> ${i + 1}. <@${storedUser}> ${user.displayName ?? user.nickname ?? user.user.username}\n`;
		}
		if (value === '') value = '> Nobody';
		return value;
	};

	const playerValue = getList(players);
	const backupValue = getList(backups);

	const embed = new EmbedBuilder();
	embed.setTitle(title);
	embed.setDescription('Click on the appropriate buttons to join a group.');
	embed.setColor(Colors.White);

	// if (signup.id === '64a84b0160cb5ed45721c111') {
	// 	embed.addFields({
	// 		name: `Spectators (${playerCounter})`,
	// 		value: playerValue.trim(),
	// 		inline: true,
	// 	});
	// } else {
	embed.addFields(
		{
			name: `Players (${playerCounter})`,
			value: playerValue.trim(),
			inline: true,
		},
		{
			name: `Backups (${backupCounter})`,
			value: backupValue.trim(),
			inline: true,
		}
	);

	const row = new ActionRowBuilder<ButtonBuilder>();

	const joinButton = new ButtonBuilder().setCustomId(signupsJoin.createCustomID(signup.id)).setEmoji('✅').setLabel('Play').setStyle(ButtonStyle.Secondary);
	if (signup.limit && signup.players.length >= signup.limit) {
		joinButton.setDisabled(true);
	}

	// if (signup.id === '64a84b0160cb5ed45721c111') joinButton.setLabel('Spectate');

	row.addComponents(joinButton);

	// if (signup.id !== '64a84b0160cb5ed45721c111')
	row.addComponents(new ButtonBuilder().setCustomId(signupsBackup.createCustomID(signup.id)).setEmoji('❔').setLabel('Backup').setStyle(ButtonStyle.Secondary));
	row.addComponents(new ButtonBuilder().setCustomId(signupsRemove.createCustomID(signup.id)).setEmoji('❌').setStyle(ButtonStyle.Secondary));
	return { embed, row };
}
