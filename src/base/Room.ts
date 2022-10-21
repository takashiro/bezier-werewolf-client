import {
	Role,
	Room as RoomConfig,
} from '@bezier/werewolf-core';

import {
	ClientContext,
	HttpError,
} from '@karuta/rest-client';

export default class Room extends ClientContext {
	protected config?: RoomConfig;

	getId(): number | undefined {
		return this.config?.id;
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

	clearStorage(): void {
		this.removeItem('config');
	}

	async fetchConfig(): Promise<RoomConfig> {
		if (this.config) {
			return this.config;
		}

		try {
			this.config = this.readItem('config');
		} catch (error) {
			// ignore
		}

		if (this.config) {
			return this.config;
		}

		const res = await this.client.get(`room/${this.id}`);
		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}
		this.config = await res.json();
		if (!this.config) {
			throw new Error('No configuration returned from server.');
		}
		this.saveItem('config', this.config);
		return this.config;
	}
}
