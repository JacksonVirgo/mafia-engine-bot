import { AnySelectMenuInteraction, ButtonInteraction, Collection, ModalBuilder, ModalSubmitInteraction } from 'discord.js';
import { Interaction as BaseInteraction } from 'discord.js';
type CustomID = string;
type AnyOutcome = any | Promise<any>;

type EventFunc = (...val: any) => AnyOutcome;
export class Event {
	static events: Collection<CustomID, Event> = new Collection();
	private event: CustomID;
	private func: EventFunc | undefined;
	constructor(event: CustomID) {
		this.event = event;
		Event.events.set(this.event, this);

		console.log(`Loaded [${this.event}]`);
	}

	public getCustomID() {
		return this.event;
	}

	public onExecute(func: EventFunc) {
		this.func = func;
		return this;
	}

	public execute(...val: any) {
		if (this.func) this.func(...val);
	}
}

export class Interaction {
	private customId: CustomID;
	constructor(customId: CustomID) {
		// Check REGEX if contains an underscore.
		this.customId = customId;

		console.log(`Loaded [${this.customId}]`);
	}

	public getCustomID() {
		return this.customId;
	}

	public createCustomID(data: string) {
		// Check REGEX if contains an underscore.
		return `${this.customId}_${data}`;
	}

	static getDataFromCustomID(customIdString: string): [CustomID, string] {
		const split = customIdString.split('_');
		return [split[0], split[1]];
	}
}

export class Button extends Interaction {
	static buttons: Collection<CustomID, Button> = new Collection();
	private func: undefined | ((i: ButtonInteraction, cache?: string) => any | Promise<any>);

	constructor(customId: CustomID) {
		super(customId);
		Button.buttons.set(customId, this);
	}

	public onExecute(func: (i: ButtonInteraction, cache?: string) => any | Promise<any>) {
		this.func = func;
		return this;
	}

	public execute(i: ButtonInteraction, cacheHandle: string) {
		if (!i.isButton()) return;
		if (this.func) this.func(i, cacheHandle);
	}
}

export class SelectMenu extends Interaction {
	static selectMenus: Collection<CustomID, SelectMenu> = new Collection();
	private func: undefined | ((i: AnySelectMenuInteraction, cache: string) => any | Promise<any>);

	constructor(customId: CustomID) {
		super(customId);
		SelectMenu.selectMenus.set(customId, this);
	}

	public onExecute(func: (i: AnySelectMenuInteraction, cache: string) => any | Promise<any>) {
		this.func = func;
		return this;
	}

	public execute(i: AnySelectMenuInteraction, cacheHandle: string) {
		if (!i.isAnySelectMenu()) return;
		if (this.func) this.func(i, cacheHandle);
	}
}

export type ModalFunc = (i: ModalSubmitInteraction, cache: string) => AnyOutcome;
export class Modal extends Interaction {
	static modals: Collection<CustomID, Modal> = new Collection();
	private func: undefined | ModalFunc;
	private modalBuilder: ModalBuilder;

	constructor(customId: CustomID, modal: ModalBuilder) {
		super(customId);
		this.modalBuilder = modal;
		this.modalBuilder.setCustomId(customId);
		Modal.modals.set(customId, this);
	}

	public getModal() {
		return this.modalBuilder;
	}

	public onExecute(func: ModalFunc) {
		this.func = func;
		return this;
	}

	public execute(i: ModalSubmitInteraction, cacheHandle: string) {
		if (!i.isModalSubmit()) return;
		if (this.func) this.func(i, cacheHandle);
	}
}
