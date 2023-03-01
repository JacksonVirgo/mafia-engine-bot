import { Channel } from '@prisma/client';
import { EmbedBuilder, Message, TextChannel } from 'discord.js';
import { prisma } from '../..';
import { SelectMenu } from '../../structures/interactions';

async function createOrFetchGame(gameTag: string) {
	try {
		const fetchedGame = await prisma.game.findUnique({
			where: { gameTag },
		});

		if (fetchedGame) return fetchedGame;

		const newGame = await prisma.game.create({
			data: {
				gameTag,
			},
		});

		return newGame;
	} catch (err) {
		console.log(err);
		return null;
	}
}

async function archiveChannel(channel: TextChannel, gameTag: string) {
	try {
		const newChannel = await prisma.channel.create({
			data: {
				channelId: channel.id,
				guildId: channel.guildId,
				name: channel.name,
				game: {
					connect: {
						gameTag: gameTag,
					},
				},
			},
		});

		console.log(newChannel);

		if (!newChannel) return null;

		// Iterate through Messages

		const messagesToArchive = new Map<string, Message>();
		// Create message pointer
		let message = await channel.messages.fetch({ limit: 1 }).then((messagePage) => (messagePage.size === 1 ? messagePage.at(0) : null));

		let totalCount = 0;

		let whileIndex = 0;

		while (message) {
			console.log('WHILE LOOP ITERATION');
			whileIndex += 1;
			const messages = await channel.messages.fetch({ limit: 100, before: message.id });

			if (whileIndex === 1) messages.set(message.id, message);
			for (let i = 0; i < messages.size; i++) {
				console.log(i);
				const { archived, count, error, alreadyExists } = await archiveMessage(messages.at(i), newChannel, gameTag);
				totalCount += count;
				console.log(whileIndex, i, totalCount, error, alreadyExists ? 'REPEATED' : 'CREATED');
			}
			message = 0 < messages.size ? messages.at(messages.size - 1) : null;

			console.log('ITERATION');
			// await i.editReply({ embeds: [createProgressEmbed(channel, messagesToArchive, null)] });
		}

		return newChannel;
	} catch (err) {
		return null;
	}
}

async function archiveMessage(msg: Message, archivedChannel: Channel, gameTag: string) {
	console.log(msg.cleanContent);
	let count = 0;
	try {
		const reference = msg.reference;
		const channel = msg.channel as TextChannel;
		let referenceMsg: Message | undefined = undefined;
		if (reference) {
			const referenceId = reference.messageId;
			referenceMsg = await msg.channel.messages.fetch(referenceId);
			const otherArchive = await archiveMessage(referenceMsg, archivedChannel, gameTag);
			count += otherArchive.count;
		}

		let repliedTo: string | undefined;
		if (referenceMsg) repliedTo = referenceMsg.id;

		const alreadyExists = await prisma.message.findUnique({ where: { messageId: msg.id } });
		if (alreadyExists) return { archived: alreadyExists, count, alreadyExists: true };

		let storedMessage = await prisma.message.create({
			data: {
				createdAt: msg.createdAt,
				editedAt: msg.editedAt,
				guildId: msg.guildId,
				messageId: msg.id,
				author: {
					connectOrCreate: {
						create: {
							discordId: msg.author.id,
						},
						where: {
							discordId: msg.author.id,
						},
					},
				},
				pinned: msg.pinned ?? false,
				cleanContent: msg.cleanContent,
				channel: {
					connect: {
						id: archivedChannel.id,
					},
				},
				repliedTo,
			},
		});

		if (msg.hasThread) {
			try {
				await msg.thread.fetch();
				const thread = msg.thread;

				const newThread = await prisma.thread.create({
					data: {
						message: {
							connect: {
								id: storedMessage.id,
							},
						},
						channel: {
							connectOrCreate: {
								where: {
									channelId: thread.id,
								},
								create: {
									channelId: thread.id,
									guildId: thread.guildId,
									name: thread.name,
									game: {
										connect: {
											gameTag,
										},
									},
								},
							},
						},
					},
					include: {
						channel: true,
					},
				});

				const messagesToArchive = new Map<string, Message>();
				// Create message pointer
				let message = await channel.messages.fetch({ limit: 1 }).then((messagePage) => (messagePage.size === 1 ? messagePage.at(0) : null));

				let totalCount = 0;

				let whileIndex = 0;

				while (message) {
					console.log('WHILE LOOP ITERATION');
					whileIndex += 1;
					const messages = await channel.messages.fetch({ limit: 100, before: message.id });

					if (whileIndex === 1) messages.set(message.id, message);
					for (let i = 0; i < messages.size; i++) {
						console.log(i);
						const { archived, count, error, alreadyExists } = await archiveMessage(messages.at(i), newThread.channel, gameTag);
						totalCount += count;
						console.log(whileIndex, i, totalCount, error, alreadyExists ? 'REPEATED' : 'CREATED');
					}
					message = 0 < messages.size ? messages.at(messages.size - 1) : null;

					console.log('ITERATION');
					// await i.editReply({ embeds: [createProgressEmbed(channel, messagesToArchive, null)] });
				}
			} catch (err) {
				return null;
			}
		}

		return { archived: storedMessage, count: count + 1 };
	} catch (err) {
		console.log(err);
		return { error: true, count };
	}
}

export default new SelectMenu('archive-game').onExecute(async (i, cache) => {
	if (!cache) return;
	if (!i.guild) return;
	if (!i.isChannelSelectMenu()) return i.reply('Not channel select menu');

	await i.message.edit({ content: 'Archiving', components: [] });

	const channelIDs = [];
	i.values.forEach((v) => channelIDs.push(v));

	const game = await createOrFetchGame(cache);
	if (!game) return i.reply({ content: 'Could not fetch/create a new game', ephemeral: true });

	await i.deferReply();

	for (let index = 0; index < channelIDs.length; index++) {
		const channelID = channelIDs[index];
		const message = await i.channel.send(`Archiving <#${channelID}> (jk not yet)`);

		await i.guild.channels.fetch();

		const channel = i.guild.channels.cache.get(channelID) as TextChannel;
		if (!channel) {
			await message.edit(`<#${channelID}> cannot be fetched.`);
		} else {
			const archivedChannel = await archiveChannel(channel, game.gameTag);
			if (archivedChannel) {
				await message.edit(`<#${channelID}> archived`);
			} else {
				await message.edit(`<#${channelID}> failed to archive`);
			}
		}
	}

	await i.editReply('Done?');

	// Iterate through each channel
	//      - Archive channel data
	//      - Archive message data individually.
	//          - If hit a thread. Archive that thread as a channel, and then all messages. And then continue.
});
