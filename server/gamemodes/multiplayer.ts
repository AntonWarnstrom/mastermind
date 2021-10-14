import { Game } from './game';
import { player, validationAnswer } from "../types/types";

export class Multiplayer extends Game {
	hostPlayer: string;
	connectedPlayers: player[];
	readonly maxPlayers: number;
	active: boolean;
	scores: validationAnswer[] | undefined;

	constructor(gameId: string, hostId: string, maxPlayers: number, positions: number, tries: number, active: boolean) {
		super(gameId, positions, tries);
		this.hostPlayer = hostId;
		this.maxPlayers = maxPlayers;
		this.connectedPlayers = [];
		this.active = active;
		this.scores = new Array();
	}

}