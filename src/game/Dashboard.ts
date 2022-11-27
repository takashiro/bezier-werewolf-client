import {
	Role,
	Selection,
} from '@bezier/werewolf-core';

import type DashboardPlayer from '../base/DashboardPlayer';
import type Collection from '../collection/Collection';
import { SkillConstructor } from '../collection/CollectionEntry';

import BasicBoard from './BasicBoard';
import { BoardOptions } from './Board';
import type Player from './Player';
import type Skill from './Skill';

export default class Dashboard extends BasicBoard {
	protected self: DashboardPlayer;

	protected me?: Player;

	protected collections: Collection[] = [];

	protected skills: Skill[] = [];

	constructor(self: DashboardPlayer, options: BoardOptions) {
		super(options);
		this.self = self;
	}

	/**
	 * Add a game collection with new role cards.
	 * @param col game collection
	 */
	addCollection(col: Collection): void {
		this.collections.push(col);
	}

	/**
	 * Get prepared to start the game.
	 *  - Fetch your current role.
	 *  - Fetch your skills.
	 *  - Initialize others.
	 */
	async start(): Promise<void> {
		const vision = await this.self.fetchBoard();
		this.update(vision);

		const myProfile = await this.self.fetchProfile();
		const me = this.getPlayer(myProfile.seat);
		this.me = me;
		me.update(myProfile);
		this.addSkills(me.getRole());
	}

	/**
	 * Add skills to the dashboard player.
	 * @param role player role
	 */
	addSkills(role: Role): void {
		const owner = this.me;
		if (!owner) {
			throw new Error('Too early to add skills.');
		}

		const SkillClasses = this.findSkills(role);
		const skills = SkillClasses.map((SkillClass) => new SkillClass(this, owner));
		const pos = this.skills.findIndex((skill) => !skill.isUsed());
		if (pos < 0) {
			this.skills.push(...skills);
		} else {
			this.skills.splice(pos, 0, ...skills);
		}
	}

	/**
	 * Find skill constructors.
	 * @param role player role
	 * @returns skill constructors
	 */
	findSkills(role: Role): SkillConstructor[] {
		const mySkills: SkillConstructor[] = [];
		for (const col of this.collections) {
			const skills = col.getSkills(role);
			if (skills) {
				mySkills.push(...skills);
			}
		}
		return mySkills;
	}

	/**
	 * Send selected cards and players to the back-end to invoke the current skill.
	 * New vision data will be updated to the game board.
	 */
	async invokeCurrentSkill(): Promise<boolean> {
		const skill = this.getCurrentSkill();
		if (!skill) {
			return false;
		}

		const cards = this.getSelectedCards();
		const players = this.getSelectedPlayers();
		const sel: Selection = {
			cards: cards.length > 0 ? cards.map((card) => card.getIndex()) : undefined,
			players: players.length > 0 ? players.map((player) => player.getSeat()) : undefined,
		};
		const skillIndex = this.getSkillIndex(skill);
		const vision = await this.self.invokeSkill(skillIndex, sel);
		this.update(vision);
		skill.takeEffect();
		return true;
	}

	/**
	 * @returns current skill
	 */
	getCurrentSkill(): Skill | undefined {
		return this.skills.find((skill) => !skill.isUsed());
	}

	/**
	 * @returns current skill index
	 */
	getSkillIndex(skill: Skill): number {
		return this.skills.indexOf(skill);
	}

	/**
	 * @returns all skills
	 */
	getSkills(): Skill[] {
		return this.skills;
	}
}
