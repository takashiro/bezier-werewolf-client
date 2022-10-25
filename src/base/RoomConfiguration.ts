import { Role } from '@bezier/werewolf-core';

interface RoleReplica {
	role: Role;
	num: number;
}

interface RoomRawConfig {
	roles: RoleReplica[];
}

/**
 * All options to create a new room.
 */
export default class RoomConfiguration {
	protected readonly storage: Storage;

	protected readonly roles = new Map<Role, number>();

	constructor(storage: Storage) {
		this.storage = storage;
	}

	/**
	 * Set the number of a role.
	 * @param role role
	 * @param num number of the role
	 */
	setRoleNum(role: Role, num: number): void {
		this.roles.set(role, num);
	}

	/**
	 * Get the number of a role.
	 * @param role role
	 * @returns number of the role
	 */
	getRoleNum(role: Role): number {
		return this.roles.get(role) || 0;
	}

	/**
	 * Get the numbers of all roles.
	 * @returns
	 */
	getRoleNums(): [Role, number][] {
		const items = [...this.roles.entries()];
		return items.filter(([role, num]) => role !== Role.Unknown && num >= 0);
	}

	/**
	 * Get all roles. Duplicated roles exist in the array.
	 * @returns an array of all roles
	 */
	getRoles(): Role[] {
		const roles: Role[] = [];
		for (const [role, num] of this.getRoleNums()) {
			for (let i = 0; i < num; i++) {
				roles.push(role);
			}
		}
		return roles;
	}

	/**
	 * Reset to default configuration.
	 */
	reset(): void {
		this.roles.clear();
		this.roles.set(Role.Werewolf, 2);
		this.roles.set(Role.Minion, 1);
		this.roles.set(Role.Villager, 2);
		this.roles.set(Role.Seer, 1);
		this.roles.set(Role.Troublemaker, 1);
		this.roles.set(Role.Robber, 1);
		this.roles.set(Role.Drunk, 1);
		this.roles.set(Role.Tanner, 1);
	}

	/**
	 * Convert it to JSON object.
	 */
	toJSON(): RoomRawConfig {
		const roles: RoleReplica[] = [];
		for (const [role, num] of this.getRoleNums()) {
			roles.push({
				role,
				num,
			});
		}

		return {
			roles,
		};
	}

	/**
	 * Parse raw data.
	 * @param raw raw data
	 */
	parse(raw: Partial<RoomRawConfig>): void {
		const { roles } = raw;
		if (roles) {
			this.roles.clear();
			for (const rep of roles) {
				this.roles.set(rep.role, rep.num);
			}
		}
	}

	/**
	 * Read configurations from local storage.
	 * @return Whether valid data are restored from local storage.
	 */
	read(): boolean {
		const rawConfig = this.storage.getItem('roomConfig');
		if (!rawConfig) {
			return false;
		}

		try {
			const config: Partial<RoomRawConfig> = JSON.parse(rawConfig);
			this.parse(config);
		} catch (error) {
			return false;
		}

		return true;
	}

	/**
	 * Save configurations to local storage.
	 */
	save(): void {
		const data = JSON.stringify(this);
		this.storage.setItem('roomConfig', data);
	}
}
