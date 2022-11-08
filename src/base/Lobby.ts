import mitt, { EventType } from 'mitt';
import {
	LobbyStatus,
	GameConfig,
	Room as RoomConfig,
} from '@bezier/werewolf-core';
import { ClientContext, HttpError } from '@karuta/rest-client';

import Room from './Room';

interface Events {
	roomChanged: Room;
	[event: EventType]: unknown;
}

type ExpiryMap = Record<string, number>;

export default class Lobby extends ClientContext {
	protected currentRoom?: Room;

	protected expiryMap: ExpiryMap = {};

	protected expiryLimit = 12 * 3600;

	protected readonly mitt = mitt<Events>();

	readonly on = this.mitt.on;

	readonly off = this.mitt.off;

	async getStatus(): Promise<LobbyStatus> {
		const res = await this.client.get('status');
		if (res.status !== 200) {
			throw new Error('The server is not running.');
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
	async createRoom(options: GameConfig): Promise<void> {
		const res = await this.client.post('room', {
			body: JSON.stringify(options),
		});

		if (res.status !== 200) {
			throw new HttpError(res.status, await res.text());
		}

		const config: RoomConfig = await res.json();
		const room = this.#createRoom(config.id);
		room.setConfig(config);
		this.saveRoom(room);

		this.setRoom(room);
	}

	/**
	 * Enter an existing room.
	 * If it's successful, the current room will be changed.
	 * @param id Room ID
	 */
	async enterRoom(id: number): Promise<void> {
		delete this.currentRoom;

		const room = this.#createRoom(id);
		if (this.hasRoom(room)) {
			try {
				await room.fetchConfig();
				this.setRoom(room);
			} catch (error) {
				// Ignore
			}
		}

		await room.fetchConfig();
		this.setRoom(room);
		this.saveRoom(room);
	}

	/**
	 * Check whether a room is already in the local storage.
	 * @param room room instance
	 * @returns
	 */
	protected hasRoom(room: Room): boolean {
		const id = room.getId();
		const expiryMap = this.filterExpiryMap();
		return Boolean(id && expiryMap[id]);
	}

	/**
	 * Save a room to the expiry map.
	 * @param room room instance
	 */
	protected saveRoom(room: Room): void {
		const id = room.getId();
		if (!id) {
			throw new Error('The room has no configuration.');
		}
		this.expiryMap[id] = new Date().getTime() + 3600 * 1000;
		this.saveExpiryMap();
	}

	/**
	 * Create a room instance by id.
	 * @param id Room ID
	 * @returns a new room instance
	 */
	#createRoom(id: number): Room {
		const client = this.client.derive(`room/${id}`);
		return new Room(client, this.storage && {
			id: String(id),
			storage: this.storage.getApi(),
		});
	}

	/**
	 * @returns A map of rooms in the local storage.
	 */
	protected filterExpiryMap(): ExpiryMap {
		try {
			this.readExpiryMap();
		} catch (error) {
			// Ignore
		}

		const now = new Date().getTime();
		const roomIds = Object.keys(this.expiryMap);

		let modified = false;
		for (const roomId of roomIds) {
			const expiry = this.expiryMap[roomId];
			if (expiry <= now) {
				modified = true;
				delete this.expiryMap[roomId];
				const id = Number.parseInt(roomId, 10);
				if (Number.isNaN(id)) {
					continue;
				}
				const room = this.#createRoom(id);
				room.clearStorage();
			}
		}

		if (modified) {
			try {
				this.saveExpiryMap();
			} catch (error) {
				// Ingore
			}
		}

		return this.expiryMap;
	}

	protected readExpiryMap(): void {
		this.expiryMap = this.readItem('expiry-map');
	}

	protected saveExpiryMap(): void {
		if (!this.expiryMap) {
			return;
		}
		this.saveItem('expiry-map', this.expiryMap);
	}
}
