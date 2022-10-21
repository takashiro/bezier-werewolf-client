import { Player as PlayerProfile } from '@bezier/werewolf-core';
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

	async fetchProfile(seat: number): Promise<PlayerProfile> {
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
		const res = await this.client.get(`player/${seat}/seat?seatKey=${seatKey}`);
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
}
