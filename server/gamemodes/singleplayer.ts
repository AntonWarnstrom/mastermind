import { Game } from './game';

export class Singleplayer extends Game {

	constructor(gameId: string, positions: number, tries: number) {
		super(gameId, positions, tries);
	}
}