"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const interactions_1 = require("../../structures/interactions");
const modal = new discord_js_1.ModalBuilder();
modal.setTitle('Example Modal');
const exampleRow = new builders_1.ActionRowBuilder();
exampleRow.addComponents(new builders_1.TextInputBuilder().setCustomId('example-param').setLabel('Example').setStyle(discord_js_1.TextInputStyle.Paragraph).setRequired(true));
modal.setComponents(exampleRow);
exports.default = new interactions_1.Modal('example-modal', modal).onExecute((i, cache) => {
    console.log('Modal');
    const result = i.fields.getTextInputValue('example-param');
    i.reply(result);
});
//# sourceMappingURL=example.js.map