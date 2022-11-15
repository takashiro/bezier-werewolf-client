import mitt, { EventType } from 'mitt';
import {
	LobbyStatus,
	GameConfig,
	Room as RoomConfig,
} from '@bezier/werewolf-core';
import {
	ClientContext,
	HttpError,
	ScopedStorage,
} from '@karuta/rest-client';

import Room from './Room';

interface Events {
	roomChanged: Room;
	[event: EventType]: unknown;
}

type ExpiryMap = Record<string, number>;

export default class Lobby extends ClientContext {
	protected currentRoom?: Room;

	protected expiryLimit = 12 * 3600;

	protected readonly mitt = mitt<Events>();

	readonly on = this.mitt.on;

	readonly off = this.mitt.off;

	async getStatus(): Promise<LobbyStatus> {
		const res = await this.client.get('status');
		if (res.status !== 200) {
			throw new Error(await res.text());
		}
		return res.json();
	}

	/**
	 * @returns The current room where the user is in.
	 */
	getRoom(): Room | undefined {
		return this.currentRoom;
	}

	protected setRoom(room: Room): void {
		this.currentRoom = room;
		this.mitt.emit('roomChanged', room);
	}

	/**
	 * Create a new room.
	 * The request will be sent to server.
	 * @param options room options
	 */
	async createRoom(options: GameConfig): Promise<Room> {
		const res = await this.client.post('room', {
			data: options,
		});

		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}

		const config: RoomConfig = await res.json();
		const room = this.#createRoom(config.id);
		room.setConfig(config);
		room.saveConfig();
		this.saveRoom(room);
		this.setRoom(room);

		return room;
	}

	/**
	 * Enter an existing room.
	 * If it's successful, the current room will be changed.
	 * @param id Room ID
	 */
	async enterRoom(id: number): Promise<Room> {
		delete this.currentRoom;
		const room = this.#createRoom(id);
		if (this.hasRoom(id)) {
			room.readConfig();
		}
		if (!room.getConfig()) {
			await room.fetchConfig();
			room.saveConfig();
			this.saveRoom(room);
		}
		this.setRoom(room);
		return room;
	}

	async deleteRoom(id: number, ownerKey: string): Promise<void> {
		const res = await this.client.delete(`room/${id}`, {
			query: { ownerKey },
		});
		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}
		const expiryMap = this.filterExpiryMap();
		delete expiryMap[id];
		this.saveExpiryMap(expiryMap);
	}

	/**
	 * Check whether a room is already in the local storage.
	 * @param id room id
	 * @returns
	 */
	hasRoom(id: number): boolean {
		const expiryMap = this.filterExpiryMap();
		return Boolean(id && expiryMap[id]);
	}

	/**
	 * Save a room to the expiry map.
	 * @param room room instance
	 */
	saveRoom(room: Room): void {
		const id = room.getId();
		if (id <= 0) {
			throw new Error('The room has no configuration.');
		}
		const expiryMap = this.readExpiryMap();
		expiryMap[id] = new Date().getTime() + 3600 * 1000;
		this.saveExpiryMap(expiryMap);
	}

	/**
	 * Create a room instance by id.
	 * @param id Room ID
	 * @returns a new room instance
	 */
	#createRoom(id: number): Room {
		const client = this.client.derive(`room/${id}`);
		const room = new Room(client);
		if (this.storage) {
			room.setStorage(new ScopedStorage(`room-${id}`, this.storage.getApi()));
		}
		room.setId(id);
		return room;
	}

	/**
	 * @returns A map of rooms in the local storage.
	 */
	protected filterExpiryMap(): ExpiryMap {
		const expiryMap = this.readExpiryMap();
		const now = new Date().getTime();
		const roomIds = Object.keys(expiryMap);

		let modified = false;
		for (const roomId of roomIds) {
			const expiry = expiryMap[roomId];
			const id = Number.parseInt(roomId, 10);
			if (Number.isNaN(id)) {
				delete expiryMap[roomId];
				continue;
			}
			if (expiry <= now) {
				modified = true;
				delete expiryMap[roomId];
				const room = this.#createRoom(id);
				room.clearStorage();
			}
		}
		if (modified) {
			try {
				this.saveExpiryMap(expiryMap);
			} catch (error) {
				// Ingore
			}
		}

		return expiryMap;
	}

	protected readExpiryMap(): ExpiryMap {
		try {
			return this.readItem('expiry-map');
		} catch (error) {
			return {};
		}
	}

	protected saveExpiryMap(expiryMap: ExpiryMap): void {
		this.saveItem('expiry-map', expiryMap);
	}
}
