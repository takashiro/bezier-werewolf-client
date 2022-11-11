import {
	LynchResult,
	Player as PlayerProfile,
	Selection,
	Vision,
} from '@bezier/werewolf-core';
import {
	ClientContext,
	HttpError,
} from '@karuta/rest-client';

import randstr from '../util/randstr';

export default class DashboardPlayer extends ClientContext {
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

		const seatKey = this.fetchSeatKey();
		const res = await this.client.get(`seat?seatKey=${seatKey}`);
		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}

		this.profile = await res.json();
		if (!this.profile) {
			throw new Error('No data is returned from the server.');
		}
		this.saveItem(itemName, this.profile);
		return this.profile;
	}

	protected getAuthParams(): string {
		const query = new URLSearchParams({
			seatKey: this.fetchSeatKey(),
		});
		return query.toString();
	}

	async fetchBoard(): Promise<Vision> {
		const res = await this.client.get(`board?${this.getAuthParams()}`);
		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}
		return res.json();
	}

	async invokeSkill(skillIndex: number, selection: Selection = {}): Promise<Vision> {
		const res = await this.client.post(`skill/${skillIndex}?${this.getAuthParams()}`, {
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(selection),
		});
		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}

		try {
			return await res.json();
		} catch (error) {
			return {};
		}
	}

	async lynchPlayer(seat: number): Promise<void> {
		const data = { target: seat };
		const res = await this.client.post(`lynch?${this.getAuthParams()}`, {
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}
	}

	async fetchLynchResult(): Promise<LynchResult> {
		const res = await this.client.get(`lynch?${this.getAuthParams()}`);
		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}
		return res.json();
	}
}
