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
const discord_js_1 = require("discord.js");
const BotClient_1 = require("../../structures/BotClient");
const data = new discord_js_1.SlashCommandBuilder().setName('prods').setDescription('Generate prods');
data.addRoleOption((role) => role.setName('aliveline').setDescription('Role which all living players have').setRequired(true));
data.addChannelOption((channel) => channel.setName('channel').setDescription('Channel to check prods within').addChannelTypes(discord_js_1.ChannelType.GuildText).setRequired(true));
data.addIntegerOption((str) => str.setName('since').setDescription('Timestamp of the message you want to check prods since').setRequired(true));
exports.default = (0, BotClient_1.newSlashCommand)({
    data,
    execute: (i) => __awaiter(void 0, void 0, void 0, function* () {
        const aliveLine = i.options.getRole('aliveline', true);
        const channel = i.options.getChannel('channel', true);
        const since = i.options.getInteger('since', true);
        if (!i.guild)
            return;
        yield i.deferReply({ ephemeral: true });
        try {
            const prodChecks = {};
            const role = i.guild.roles.cache.get(aliveLine.id);
            if (!role)
                throw Error('Invalid role');
            const users = role.members.map((m) => m.user.id);
            users.forEach((user) => {
                prodChecks[user] = [];
            });
            let message = yield channel.messages.fetch({ limit: 1 }).then((messagePage) => (messagePage.size === 1 ? messagePage.at(0) : null));
            while (message) {
                let hitProdThreshold = false;
                yield channel.messages.fetch({ limit: 100, before: message.id }).then((messagePage) => {
                    messagePage.forEach((msg) => {
                        if (msg.createdTimestamp < since)
                            hitProdThreshold = true;
                        if (users.includes(msg.author.id)) {
                            if (msg.createdTimestamp >= since) {
                                prodChecks[msg.author.id].push(msg);
                            }
                        }
                    });
                    message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
                    if (hitProdThreshold)
                        message = null;
                });
            }
            const embed = new discord_js_1.EmbedBuilder();
            embed.setTitle('Prod Check');
            embed.setColor(discord_js_1.Colors.White);
            const prodded = [];
            for (const userID in prodChecks) {
                console.log(`checking ${userID}`);
                const list = prodChecks[userID];
                if (list.length < 25)
                    prodded.push(`<@${userID}> has ${list.length}/${20} messages.`);
            }
            if (prodded.length > 0)
                embed.addFields({ name: 'Prodded', value: prodded.join('\n') });
            else
                embed.setDescription('Nobody was prodded!');
            yield i.editReply({ embeds: [embed] });
        }
        catch (err) {
            console.log(err);
            yield i.editReply('An error has occurred');
        }
    }),
});
//# sourceMappingURL=prods.js.map