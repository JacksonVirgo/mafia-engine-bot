import { Client, Events } from 'discord.js';
import { Event } from '../../structures/interactions';

export default function ClientReady(client: Client<true>) {
	console.log(`Ready! Logged in as ${client.user.tag}`);
}
