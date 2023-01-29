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
exports.client = exports.prisma = exports.config = void 0;
const BotClient_1 = require("./structures/BotClient");
const dotenv = require("dotenv");
const Cache_1 = require("./structures/Cache");
const client_1 = require("@prisma/client");
dotenv.config();
exports.config = {
    botToken: process.env.DISCORD_BOT_TOKEN,
    clientID: process.env.DISCORD_BOT_CLIENT_ID,
    cacheClearInterval: 5 * 1000,
};
exports.prisma = new client_1.PrismaClient();
exports.client = new BotClient_1.BotClient(exports.config.clientID, exports.config.botToken);
(() => __awaiter(void 0, void 0, void 0, function* () {
    setInterval(() => {
        (0, Cache_1.clearExpiredCache)();
    }, exports.config.cacheClearInterval);
    exports.client.start();
}))();
//# sourceMappingURL=index.js.map