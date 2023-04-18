import {
	Player,
	Role,
	Room as RoomConfig,
} from '@bezier/werewolf-core';

import {
	ClientContext,
	HttpError,
	ScopedStorage,
} from '@karuta/rest-client';

import DashboardPlayer from './DashboardPlayer';

export default class Room extends ClientContext {
	protected id = 0;

	protected config?: RoomConfig;

	getId(): number {
		return this.id;
	}

	setId(id: number): void {
		this.id = id;
	}

	getRoles(): Role[] | undefined {
		return this.config?.roles;
	}

	getSalt(): string | undefined {
		return this.config?.salt;
	}

	getOwnerKey(): string | undefined {
		return this.config?.ownerKey;
	}

	getConfig(): RoomConfig | undefined {
		return this.config;
	}

	setConfig(config: RoomConfig): void {
		this.config = config;
	}

	readConfig(): RoomConfig | undefined {
		try {
			this.config = this.readItem('config');
		} catch (err) {
			// ignore
		}
		return this.config;
	}

	saveConfig(): void {
		this.saveItem('config', this.config);
	}

	clearStorage(): void {
		this.removeItem('config');
	}

	async fetchConfig(): Promise<RoomConfig> {
		const res = await this.client.get('');
		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}
		this.config = await res.json();
		if (!this.config) {
			throw new Error('No configuration returned from server.');
		}
		return this.config;
	}

	getDashboardSeat(): number | undefined {
		try {
			const player = this.readItem('dashboard') as Partial<Player>;
			return player.seat;
		} catch (e) {
			// ignore
		}
	}

	protected setDashboardSeat(seat: number): void {
		this.saveItem('dashboard', { seat });
	}

	createPlayer(seat: number): DashboardPlayer {
		const client = this.client.derive(`player/${seat}`);
		const player = new DashboardPlayer(client);
		if (this.storage) {
			player.setStorage(new ScopedStorage(`dashboard-player-${this.id}-${seat}`, this.storage.getApi()));
		}
		player.on('seated', () => {
			this.setDashboardSeat(seat);
		});
		return player;
	}
}
