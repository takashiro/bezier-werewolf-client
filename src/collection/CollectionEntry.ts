import { Role } from '@bezier/werewolf-core';

import Board from '../game/Board.js';
import Player from '../game/Player.js';
import Skill from '../game/BasicSkill.js';

export type SkillConstructor = new(board: Board, owner: Player) => Skill;

interface CollectionEntry {
	role: Role;
	skills?: SkillConstructor[];
}

export default CollectionEntry;
