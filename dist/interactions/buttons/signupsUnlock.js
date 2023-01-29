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
const __1 = require("../..");
const interactions_1 = require("../../structures/interactions");
const signups_1 = require("../commands/signups");
exports.default = new interactions_1.Button('signups-unlock').onExecute((i, cache) => __awaiter(void 0, void 0, void 0, function* () {
    if (!cache)
        return i.reply({ content: 'This button is invalid', ephemeral: true });
    const signup = yield __1.prisma.signup.findUnique({
        where: {
            id: cache,
        },
    });
    if (!signup)
        return i.reply({ content: 'This signup is no longer active', ephemeral: true });
    const updatedSignup = yield __1.prisma.signup.update({
        where: {
            id: signup.id,
        },
        data: {
            isLocked: false,
        },
    });
    const { embed, row } = yield (0, signups_1.createSignupPost)(updatedSignup, i.guild, updatedSignup.isLocked);
    yield i.message.edit({ embeds: [embed], components: [row] });
    yield i.reply({ content: 'Successfully signed up', ephemeral: true });
    yield i.deleteReply();
}));
//# sourceMappingURL=signupsUnlock.js.map