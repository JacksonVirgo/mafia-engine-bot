import { Role } from '@prisma/client';
import { HexColorString, EmbedBuilder } from 'discord.js';
import { findBestMatch } from 'string-similarity';
import { prisma } from '..';

export function createRoleCardEmbed(rolecard: Role) {
	try {
		const { name, alignment, flavourText, roleColour, abilities, iconUrl, winCondition, wikiUrl } = rolecard;
		const embed = new EmbedBuilder();
		const hex = roleColour as HexColorString;

		embed.setTitle(`${name} - ${alignment}`);
		embed.setColor(hex);
		embed.addFields(
			{
				name: 'Abilities',
				value: abilities,
			},
			{
				name: 'Win Condition',
				value: winCondition,
			}
		);

		if (flavourText) embed.setDescription(`*${flavourText}*`);
		if (iconUrl) embed.setThumbnail(iconUrl);
		if (wikiUrl) embed.setURL(wikiUrl);

		return embed;
	} catch (err) {
		console.log(err);
		return null;
	}
}

export async function getListOfRolecardNames(): Promise<string[]> {
	const result: string[] = [];

	const data = await prisma.role.findMany({
		select: {
			name: true,
		},
	});

	data.forEach((v) => result.push(v.name));
	return result;
}

export async function getRole(name: string) {
	try {
		let isSpellChecked = false;
		let fetchedRole = await prisma.role.findUnique({
			where: {
				name,
			},
		});

		if (!fetchedRole) {
			const allRoleNames = await getListOfRolecardNames();
			const stringSimilarity = findBestMatch(name, allRoleNames);
			const target = stringSimilarity.bestMatch.target;

			fetchedRole = await prisma.role.findFirst({
				where: {
					name: target,
				},
			});

			isSpellChecked = true;
		}

		return fetchedRole;
	} catch (err) {
		return null;
	}
}
