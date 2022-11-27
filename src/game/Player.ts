import PlayerProfile from '@bezier/werewolf-core/Player';

import BoardObject from './BoardObject';

export default class Player extends BoardObject {
	protected seat: number;

	constructor(seat: number) {
		super();
		this.seat = seat;
	}

	getSeat(): number {
		return this.seat;
	}

	update(profile: PlayerProfile): void {
		this.setRole(profile.role);
	}
}
