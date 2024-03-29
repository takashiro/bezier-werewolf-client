import {
	LynchResult,
	Player as PlayerProfile,
	Selection,
	Vision,
} from '@bezier/werewolf-core';
import {
	ClientContext,
	HttpError,
	Query,
} from '@karuta/rest-client';

import mitt, { EventType } from '../util/mitt.js';
import randstr from '../util/randstr.js';

interface Events {
	seated: void;
	[event: EventType]: unknown;
}

export default class DashboardPlayer extends ClientContext {
	private mitt = mitt<Events>();

	readonly on = this.mitt.on;

	readonly off = this.mitt.off;

	private readonly emit = this.mitt.emit;

	seatKey?: string;

	profile?: PlayerProfile;

	clearStorage(): void {
		this.removeItem('seatKey');
		this.removeItem('profile');
	}

	fetchSeatKey(): string {
		if (this.seatKey) {
			return this.seatKey;
		}

		const itemName = 'seatKey';
		try {
			this.seatKey = this.readRawItem(itemName);
		} catch (error) {
			// Ignore
		}
		if (!this.seatKey) {
			this.seatKey = randstr(16);
			this.saveItem(itemName, this.seatKey);
		}
		return this.seatKey;
	}

	async fetchProfile(): Promise<PlayerProfile> {
		if (this.profile) {
			return this.profile;
		}

		const itemName = 'profile';
		try {
			this.profile = this.readItem(itemName);
		} catch (error) {
			// ignore
		}
		if (this.profile) {
			return this.profile;
		}

		const res = await this.client.get('seat', { query: this.getAuthParams() });
		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}

		this.profile = await res.json();
		if (!this.profile) {
			throw new Error('No data is returned from the server.');
		}
		this.saveItem(itemName, this.profile);
		this.emit('seated');
		return this.profile;
	}

	protected getAuthParams(): Query {
		return {
			seatKey: this.fetchSeatKey(),
		};
	}

	async fetchBoard(): Promise<Vision> {
		const res = await this.client.get('board', { query: this.getAuthParams() });
		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}
		return res.json();
	}

	async invokeSkill(skillIndex: number, selection: Selection = {}): Promise<Vision> {
		if (skillIndex < 0) {
			throw new Error(`Invalid skill index: ${skillIndex}`);
		}

		const res = await this.client.post(`skill/${skillIndex}`, {
			query: this.getAuthParams(),
			data: selection,
		});
		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}

		if (!res.headers.get('content-type')?.startsWith('application/json')) {
			return {};
		}

		try {
			return await res.json();
		} catch (error) {
			return {};
		}
	}

	async lynchPlayer(seat: number): Promise<void> {
		const res = await this.client.post('lynch', {
			query: this.getAuthParams(),
			data: { target: seat },
		});
		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}
	}

	async fetchLynchResult(): Promise<LynchResult> {
		const res = await this.client.get('lynch', {
			query: this.getAuthParams(),
		});
		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}
		return res.json();
	}
}
