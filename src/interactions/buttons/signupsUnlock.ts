import { prisma } from '../..';
import { Button } from '../../structures/interactions';
import { createSignupPost } from '../commands/signups';

export default new Button('signups-unlock').onExecute(async (i, cache) => {
	if (!cache) return i.reply({ content: 'This button is invalid', ephemeral: true });
	const signup = await prisma.signup.findUnique({
		where: {
			id: cache,
		},
	});

	if (!signup) return i.reply({ content: 'This signup is no longer active', ephemeral: true });

	const updatedSignup = await prisma.signup.update({
		where: {
			id: signup.id,
		},
		data: {
			isLocked: false,
		},
	});

	const { embed, row } = await createSignupPost(updatedSignup, i.guild, {
		isLocked: signup.isLocked,
	});
	await i.message.edit({ embeds: [embed], components: [row] });
	await i.reply({ content: 'Successfully signed up', ephemeral: true });
	await i.deleteReply();
});
