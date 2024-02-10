import type {
	LynchResult,
	Progress,
	Vote,
} from '@bezier/werewolf-core';

import mitt, { EventType } from '../util/mitt.js';
import type DashboardPlayer from '../base/DashboardPlayer.js';
import type Player from './Player.js';

interface Events {
	progressChanged: Progress;
	finished: Vote[];
	[event: EventType]: unknown;
}

export interface VoteGroup {
	from: Player[];
	to: Player;
}

export default class VoteBulletin {
	protected self: DashboardPlayer;

	protected progress?: Progress;

	protected votes?: Vote[];

	protected mitt = mitt<Events>();

	readonly on = this.mitt.on;

	readonly off = this.mitt.off;

	constructor(self: DashboardPlayer) {
		this.self = self;
	}

	/**
	 * @returns Progress of votes.
	 */
	getProgress(): Progress | undefined {
		return this.progress;
	}

	protected setProgress(progress: Progress): void {
		this.progress = progress;
		this.mitt.emit('progressChanged', progress);
	}

	/**
	 * @returns Whether the vote is finished.
	 */
	isFinished(): boolean {
		const progress = this.getProgress();
		if (!progress) {
			return false;
		}
		return progress.current >= progress.limit;
	}

	/**
	 * @returns Vote details.
	 */
	getVotes(): Vote[] | undefined {
		return this.votes;
	}

	protected setVotes(votes: Vote[]): void {
		this.votes = votes;
		this.mitt.emit('finished', votes);
	}

	/**
	 * Synchronize data from server side.
	 */
	async sync(): Promise<void> {
		const res = await this.self.fetchLynchResult();
		this.update(res);
	}

	protected update(res: LynchResult): void {
		this.setProgress(res.progress);
		const { votes } = res;
		if (votes) {
			this.setVotes(votes);
		}
	}
}
