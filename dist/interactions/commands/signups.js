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
exports.createSignupPost = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("../..");
const BotClient_1 = require("../../structures/BotClient");
const signupsBackup_1 = require("../buttons/signupsBackup");
const signupsJoin_1 = require("../buttons/signupsJoin");
const signupsRemove_1 = require("../buttons/signupsRemove");
const data = new discord_js_1.SlashCommandBuilder().setName('signups').setDescription('Create a signups LFG post');
data.addStringOption((title) => title.setName('title').setDescription('Title for the signup').setRequired(false));
data.addIntegerOption((limit) => limit.setName('limit').setDescription('Limit the number of signups').setRequired(false));
exports.default = (0, BotClient_1.newSlashCommand)({
    data,
    execute: (i) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        yield i.deferReply();
        const title = (_a = i.options.getString('title')) !== null && _a !== void 0 ? _a : undefined;
        const limit = (_b = i.options.getInteger('limit')) !== null && _b !== void 0 ? _b : undefined;
        const signup = yield __1.prisma.signup.create({
            data: {
                name: title,
                limit,
            },
        });
        if (!signup)
            return yield i.editReply({ content: 'Unable to create a signup' });
        const { row, embed } = yield createSignupPost(signup, i.guild);
        yield i.editReply({ embeds: [embed], components: [row] });
    }),
});
function createSignupPost(signup, guild, isLocked) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const title = (_a = signup.name) !== null && _a !== void 0 ? _a : 'Discord Mafia Signups';
        const limit = signup.limit;
        const { players, backups } = signup;
        let playerCounter = `${players.length}${limit ? `/${limit}` : ''}`;
        let backupCounter = `${backups.length}`;
        const getList = (list) => {
            let value = '';
            for (let i = 0; i < list.length; i++) {
                const storedUser = list[i];
                let base = true;
                if (base)
                    value += `> <@${storedUser}>`;
            }
            if (value === '')
                value = '> Nobody';
            return value;
        };
        const playerValue = getList(players);
        const backupValue = getList(backups);
        const embed = new discord_js_1.EmbedBuilder();
        embed.setTitle(title);
        embed.setDescription('Click on the appropriate buttons to join a group.');
        embed.setColor(discord_js_1.Colors.Blurple);
        embed.addFields({
            name: `Players (${playerCounter})`,
            value: playerValue.trim(),
            inline: true,
        }, {
            name: `Backups (${backupCounter})`,
            value: backupValue.trim(),
            inline: true,
        });
        const row = new discord_js_1.ActionRowBuilder();
        row.addComponents(new discord_js_1.ButtonBuilder().setCustomId(signupsJoin_1.default.createCustomID(signup.id)).setEmoji('✅').setLabel('Play').setStyle(discord_js_1.ButtonStyle.Secondary));
        row.addComponents(new discord_js_1.ButtonBuilder().setCustomId(signupsBackup_1.default.createCustomID(signup.id)).setEmoji('❔').setLabel('Backup').setStyle(discord_js_1.ButtonStyle.Secondary));
        row.addComponents(new discord_js_1.ButtonBuilder().setCustomId(signupsRemove_1.default.createCustomID(signup.id)).setEmoji('❌').setStyle(discord_js_1.ButtonStyle.Secondary));
        return { embed, row };
    });
}
exports.createSignupPost = createSignupPost;
//# sourceMappingURL=signups.js.map