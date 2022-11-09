import {
	Role,
	Room as RoomConfig,
} from '@bezier/werewolf-core';

import {
	ClientContext,
	HttpError,
} from '@karuta/rest-client';

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
}
