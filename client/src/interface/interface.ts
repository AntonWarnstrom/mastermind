export interface singleplayerGameInterface {
	history: [
		{
			colors: string[];
			answers: string[];
		}
	];
	winner: boolean;
	turn: number;
	selectedColor: string;
	chooseColor: boolean;
	activeRow: number;
	activePosition: number;
}

export interface multiplayerGameInterface {
	index: number
	history: [
		{
			colors: string[];
			answers: string[];
		}
	];
	chooseColor: boolean;
	selectedColor: string;
	winner: boolean;
	turn: number;
	activeRow: number;
	activePosition: number;
	scores: validationAnswer[];
	playerId: string;
}


export interface gameObject {
	readonly gameId: string;
	readonly positions: number;
	readonly tries: number;
	readonly colorList: string[];
	readonly maxPlayers: number;
	active: boolean;
	answer: String[];
	hostPlayer: string;
	connectedPlayers: player[];
}

export interface player {
	readonly playerId: string | undefined;
	ready: boolean;
}

export interface multiplayerConfig {
	readonly maxPlayers: number;
	readonly tries: number;
	readonly positions: number;
}

export interface gameInterface {
	colors: number | null;
	tries: number | null;
	maxPlayers: number | null;
	games: string[];
}

export interface validationAnswer {
	readonly success: boolean;
	answers: string[];
}

