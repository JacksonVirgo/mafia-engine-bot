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
const BotClient_1 = require("../../structures/BotClient");
const interactions_1 = require("../../structures/interactions");
function onInteraction(i) {
    return __awaiter(this, void 0, void 0, function* () {
        if (i.isChatInputCommand()) {
            const command = BotClient_1.slashCommands.get(i.commandName);
            if (!command)
                return console.error(`No command matching ${i.commandName} was found.`);
            try {
                command.execute(i);
            }
            catch (err) {
                console.log(err);
            }
        }
        else if (i.isButton()) {
            const [customId, data] = interactions_1.Button.getDataFromCustomID(i.customId);
            if (!customId)
                return;
            const buttonInteraction = interactions_1.Button.buttons.get(customId);
            if (buttonInteraction)
                buttonInteraction.execute(i, data);
        }
        else if (i.isAnySelectMenu()) {
            const [customId, data] = interactions_1.SelectMenu.getDataFromCustomID(i.customId);
            if (!customId)
                return;
            const selectInteraction = interactions_1.SelectMenu.selectMenus.get(customId);
            if (selectInteraction)
                selectInteraction.execute(i, data);
        }
        else if (i.isModalSubmit()) {
            const [customId, data] = interactions_1.Modal.getDataFromCustomID(i.customId);
            if (!customId)
                return;
            const modalInteraction = interactions_1.Modal.modals.get(customId);
            if (modalInteraction)
                modalInteraction.execute(i, data);
        }
    });
}
exports.default = onInteraction;
//# sourceMappingURL=onInteraction.js.map