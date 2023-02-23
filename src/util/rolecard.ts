import { Role } from '@prisma/client';
import { HexColorString, EmbedBuilder } from 'discord.js';
import { prisma } from '..';

export function createRoleCardEmbed(rolecard: Role) {
	try {
		const { name, alignment, flavourText, roleColour, abilities, iconUrl, winCondition } = rolecard;
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
