import BoardObject from './BoardObject';

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
