import { sign } from 'crypto';
import { prisma } from '../..';
import { Button } from '../../structures/interactions';
import { createSignupPost } from '../commands/signups';

export default new Button('signups-leave').onExecute(async (i, cache) => {
	if (!cache) return await i.reply({ content: 'This button is invalid', ephemeral: true });
	if (!cache) return i.reply({ content: 'This button is invalid', ephemeral: true });
	const signup = await prisma.signup.findUnique({ where: { id: cache } });
	if (!signup || signup.isLocked) return await i.reply({ content: 'This signup is no longer active', ephemeral: true });

	const backups = signup.backups.filter((p) => p != i.user.id);
	const players = signup.players.filter((p) => p != i.user.id);

	const updatedSignup = await prisma.signup.update({
		where: {
			id: cache,
		},
		data: {
			players,
			backups,
		},
	});

	const { embed, row } = await createSignupPost(updatedSignup, i.guild);
	await i.update({ embeds: [embed], components: [row] });
});
