import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { getAllWithRole } from '../../util/discordRole';

const StaffRoles: string[] = [
	'648664560936550400', // Co-Owners
	'648664724153565184', // Moderator
	'720121056320553021', // Helper
	'903394030904299541', // Technician
];

const data = new SlashCommandBuilder().setName('staff').setDescription('See who the current staff are');
export default newSlashCommand({
	data,
	execute: async (i) => {
		if (!i.guild) return;
		await i.deferReply();

		try {
			const allStaff: Record<string, string[]> = {};
			for (let j = 0; j < StaffRoles.length; j++) {
				const staffRoleID = StaffRoles[j];
				const { role, members } = await getAllWithRole(i.guild, staffRoleID);

				const uniqueMembers = [];
				members.forEach((v) => {
					let isUnique = true;
					for (const staffTier in allStaff) {
						const staff = allStaff[staffTier];
						if (staff.includes(v.id)) isUnique = false;
					}

					if (isUnique) uniqueMembers.push(v.id);
				});

				allStaff[role.name] = uniqueMembers;
			}

			const embed = new EmbedBuilder().setTitle('Current Staff').setThumbnail(i.guild.iconURL()).setColor('White');

			for (const staffTier in allStaff) {
				const staff = allStaff[staffTier];

				let combinedStr = '';
				staff.forEach((v) => (combinedStr += `<@${v}>\n`));
				combinedStr.trim();
				if (combinedStr === '') combinedStr = '\u200B';

				const field = {
					name: staffTier,
					value: combinedStr,
				};

				embed.addFields(field);
			}

			return i.editReply({ embeds: [embed] });
		} catch (err) {
			console.log(err);
			await i.editReply('An error has occurred');
		}
	},
});
