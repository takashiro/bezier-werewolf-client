import BoardObject from './BoardObject.js';

export default class Card extends BoardObject {
	protected index: number;

	constructor(index: number) {
		super();
		this.index = index;
	}

	getIndex(): number {
		return this.index;
	}
}
