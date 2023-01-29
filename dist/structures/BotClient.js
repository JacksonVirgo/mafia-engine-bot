"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotClient = exports.newSlashCommand = exports.slashCommands = exports.DEFAULT_INTENTS = void 0;
const discord_js_1 = require("discord.js");
const path = require("path");
const fs = require("fs");
const clientReady_1 = require("../interactions/events/clientReady");
const onInteraction_1 = require("../interactions/events/onInteraction");
exports.DEFAULT_INTENTS = { intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMembers, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent, discord_js_1.GatewayIntentBits.GuildIntegrations] };
exports.slashCommands = new discord_js_1.Collection();
function newSlashCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            exports.slashCommands.set(cmd.data.name, cmd);
            console.log(`Loaded [${cmd.data.name}]`);
            return cmd;
        }
        catch (err) {
            console.error(`Failed to load [${cmd.data.name}]`);
        }
    });
}
exports.newSlashCommand = newSlashCommand;
class BotClient extends discord_js_1.Client {
    constructor(clientID, discordToken) {
        super(exports.DEFAULT_INTENTS);
        this.interactionsPath = path.join(__dirname, '..', 'interactions');
        this.start = () => {
            if (!this.discordToken)
                return console.log('Discord Token was not supplied or is invalid');
            this.login(this.discordToken);
        };
        this.discordToken = discordToken;
        this.clientID = clientID;
        this.rest = new discord_js_1.REST({ version: '10' }).setToken(this.discordToken);
        this.loadInteractions('events');
        this.loadInteractions('commands');
        this.loadInteractions('buttons');
        this.loadInteractions('selectmenu');
        this.loadInteractions('modals');
        this.assignEvents();
        this.registerCommands();
    }
    assignEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            this.on(discord_js_1.Events.ClientReady, clientReady_1.default);
            this.on(discord_js_1.Events.InteractionCreate, onInteraction_1.default);
        });
    }
    loadInteractions(newPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandPath = path.join(this.interactionsPath, newPath);
            const files = fs.readdirSync(commandPath).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
            for (const file of files) {
                try {
                    const filePath = path.join(commandPath, file);
                    require(filePath).default;
                }
                catch (err) {
                    console.error(`Failed trying to load ${file}`);
                    console.error(err);
                }
            }
        });
    }
    registerCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const list = [];
                exports.slashCommands.forEach((val) => {
                    list.push(val.data.toJSON());
                });
                const raw = yield this.rest.put(discord_js_1.Routes.applicationCommands(this.clientID), { body: list });
                const data = raw;
                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}
exports.BotClient = BotClient;
//# sourceMappingURL=BotClient.js.map