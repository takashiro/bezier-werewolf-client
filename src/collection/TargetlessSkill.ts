import Skill from '../game/BasicSkill';

export default class TargetlessSkill extends Skill {
	override isFeasible(): boolean {
		const cards = this.board.getSelectedCards();
		const players = this.board.getSelectedPlayers();
		return cards.length <= 0 && players.length <= 0;
	}
}
