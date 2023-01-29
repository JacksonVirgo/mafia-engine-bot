"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = exports.SelectMenu = exports.Button = exports.Interaction = exports.Event = void 0;
const discord_js_1 = require("discord.js");
class Event {
    constructor(event) {
        this.event = event;
        Event.events.set(this.event, this);
        console.log(`Loaded [${this.event}]`);
    }
    getCustomID() {
        return this.event;
    }
    onExecute(func) {
        this.func = func;
        return this;
    }
    execute(...val) {
        if (this.func)
            this.func(...val);
    }
}
exports.Event = Event;
Event.events = new discord_js_1.Collection();
class Interaction {
    constructor(customId) {
        // Check REGEX if contains an underscore.
        this.customId = customId;
        console.log(`Loaded [${this.customId}]`);
    }
    getCustomID() {
        return this.customId;
    }
    createCustomID(data) {
        // Check REGEX if contains an underscore.
        return `${this.customId}_${data}`;
    }
    static getDataFromCustomID(customIdString) {
        const split = customIdString.split('_');
        return [split[0], split[1]];
    }
}
exports.Interaction = Interaction;
class Button extends Interaction {
    constructor(customId) {
        super(customId);
        Button.buttons.set(customId, this);
    }
    onExecute(func) {
        this.func = func;
        return this;
    }
    execute(i, cacheHandle) {
        if (!i.isButton())
            return;
        if (this.func)
            this.func(i, cacheHandle);
    }
}
exports.Button = Button;
Button.buttons = new discord_js_1.Collection();
class SelectMenu extends Interaction {
    constructor(customId) {
        super(customId);
        SelectMenu.selectMenus.set(customId, this);
    }
    onExecute(func) {
        this.func = func;
        return this;
    }
    execute(i, cacheHandle) {
        if (!i.isAnySelectMenu())
            return;
        if (this.func)
            this.func(i, cacheHandle);
    }
}
exports.SelectMenu = SelectMenu;
SelectMenu.selectMenus = new discord_js_1.Collection();
class Modal extends Interaction {
    constructor(customId, modal) {
        super(customId);
        this.modalBuilder = modal;
        this.modalBuilder.setCustomId(customId);
        Modal.modals.set(customId, this);
    }
    getModal() {
        return this.modalBuilder;
    }
    onExecute(func) {
        this.func = func;
        return this;
    }
    execute(i, cacheHandle) {
        if (!i.isModalSubmit())
            return;
        if (this.func)
            this.func(i, cacheHandle);
    }
}
exports.Modal = Modal;
Modal.modals = new discord_js_1.Collection();
//# sourceMappingURL=interactions.js.map