"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInteraction = exports.interactions = void 0;
const discord_js_1 = require("discord.js");
exports.interactions = new discord_js_1.Collection();
function createInteraction(i) {
    if (i.customID.indexOf('_') > -1) {
        console.log(`Interaction ${i.customID} has an invalid custom ID.`);
    }
    else {
        exports.interactions.set(i.customID, i);
    }
}
exports.createInteraction = createInteraction;
//# sourceMappingURL=BaseInteraction.js.map