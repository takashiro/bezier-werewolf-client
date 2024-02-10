import { Role } from '@bezier/werewolf-core';
import mitt, { EventType } from '../util/mitt.js';

interface Events {
	roleChanged: Role;
	selectedChanged: boolean;
	[event: EventType]: unknown;
}

export default class BoardObject {
	protected role = Role.Unknown;

	protected selected = false;

	protected readonly mitt = mitt<Events>();

	readonly on = this.mitt.on;

	readonly off = this.mitt.off;

	getRole(): Role {
		return this.role;
	}

	setRole(role: Role): void {
		this.role = role;
		this.mitt.emit('roleChanged', role);
	}

	setSelected(selected: boolean): void {
		this.selected = selected;
		this.mitt.emit('selectedChanged', selected);
	}

	isSelected(): boolean {
		return this.selected;
	}
}
