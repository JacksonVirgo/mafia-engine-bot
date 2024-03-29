import { ButtonInteraction, ChatInputCommandInteraction, Client, Collection, CommandInteraction, Events, GatewayIntentBits, Interaction, REST, Routes, SlashCommandBuilder } from 'discord.js';
import * as path from 'path';
import * as fs from 'fs';
import { interactions } from './BaseInteraction';
import { Button, Event, Modal, SelectMenu } from './interactions';
import OnClientReady from '../interactions/events/clientReady';
import OnInteraction from '../interactions/events/onInteraction';
import { ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';
import { config } from '..';

export const DEFAULT_INTENTS = {
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildIntegrations],
};

export const slashCommands: Collection<string, SlashCommand> = new Collection();
export interface SlashCommand {
	data: SlashCommandBuilder;
	mainServer?: boolean;
	execute: (i: ChatInputCommandInteraction) => any | Promise<any>;
}

export async function newSlashCommand(cmd: SlashCommand) {
	try {
		slashCommands.set(cmd.data.name, cmd);
		console.log(`Loaded [${cmd.data.name}]`);
		return cmd;
	} catch (err) {
		console.error(`Failed to load [${cmd.data.name}]`);
	}
}

export class BotClient extends Client {
	public rest: REST;

	private discordToken: string;
	public clientID: string;

	public interactionsPath = path.join(__dirname, '..', 'interactions');

	constructor(clientID: string, discordToken: string) {
		super(DEFAULT_INTENTS);
		this.discordToken = discordToken;
		this.clientID = clientID;
		this.rest = new REST({ version: '10' }).setToken(this.discordToken);

		this.loadInteractions<Event>('events');
		this.loadInteractions<SlashCommand>('commands');
		this.loadInteractions<Button>('buttons');
		this.loadInteractions<SelectMenu>('selectmenu');
		this.loadInteractions<Modal>('modals');
		// this.loadInteractions<ContextMenuCommandBuilder>('context');

		this.assignEvents();
		this.registerCommands();
	}

	private async assignEvents() {
		this.on(Events.ClientReady, OnClientReady);
		this.on(Events.InteractionCreate, OnInteraction);
	}

	public start = () => {
		if (!this.discordToken) return console.log('Discord Token was not supplied or is invalid');
		this.login(this.discordToken);
	};

	public async loadInteractions<T>(newPath: string) {
		const commandPath = path.join(this.interactionsPath, newPath);
		const files = fs.readdirSync(commandPath).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
		for (const file of files) {
			try {
				const filePath = path.join(commandPath, file);
				require(filePath).default as T;
			} catch (err) {
				console.error(`Failed trying to load ${file}`);
				console.error(err);
			}
		}
	}

	public async registerCommands() {
		try {
			const allServerList: any[] = [];
			const mainServerList: any[] = [];

			slashCommands.forEach((val) => {
				if (val.mainServer) mainServerList.push(val.data.toJSON());
				else allServerList.push(val.data.toJSON());
			});

			await this.guilds.fetch();
			const guild = this.guilds.cache.get(config.MAIN_SERVER_ID);
			if (mainServerList.length > 0) {
				const raw = await this.rest.put(Routes.applicationGuildCommands(this.clientID, config.MAIN_SERVER_ID), { body: mainServerList });
				const data = raw as any;
				console.log(`[GUILD] Successfully reloaded ${data.length} application (/) commands.\n`);
			}

			const raw = await this.rest.put(Routes.applicationCommands(this.clientID), { body: allServerList });
			const data = raw as any;
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (err) {
			console.error(err);
		}
	}
}
