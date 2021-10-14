export interface singleplayerGameOption {
	readonly positions: number;
	readonly tries: number;
}

export interface multiplayerConfig {
	readonly maxPlayers: number;
	readonly tries: number;
	readonly positions: number;
}

export interface player {
	username: string;
	readonly playerId: string | undefined;
	ready: boolean;
}

export interface guessValidation {
	readonly gameId: string;
	playerId: string;
	colors: string[];
}

export interface validationAnswer {
	readonly success: boolean;
	answers: string[];
	totalPoints: number;
	playerId: string;
}

