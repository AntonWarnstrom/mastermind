import { guessValidation, validationAnswer } from '../types/types';
import { colors } from '../utils/utils'

export class Game {
	readonly gameId: string;
	readonly positions: number;
	readonly tries: number;
	readonly colorList = colors.default;
	private answer: String[];

	constructor(gameId: string, positions: number, tries: number) {
		this.gameId = gameId;
		this.positions = positions;
		this.tries = tries;
		this.answer = this.generateAnswer(positions)
	}

	private getRandomInt(max: number) {
		return Math.floor(Math.random() * max);
	}

	private generateAnswer(difficulty: number | 4): string[] {
		let colorsAndPositions: string[] = new Array(difficulty)
		const numberOfColors = colors.default.length;
		for (let i = 0; i < difficulty; i++) {
			colorsAndPositions[i] = this.colorList[this.getRandomInt(numberOfColors)]
		}
		return colorsAndPositions;
	}

	getColorAnswer() {
		return this.answer;
	}

	validateGuess(payload: guessValidation): validationAnswer {
		let correctAnswers: string[] = new Array();
		let colorsArrayLength = payload.colors.length;
		let points = 0;
		for (let i = 0; i < colorsArrayLength; i++) {
			if (payload.colors[i] === this.answer[i]) {
				correctAnswers.push("black")
				points += 2;
			} else if (this.answer.includes(payload.colors[i]) && payload.colors[i] != this.answer[i]) {
				correctAnswers.push("gray")
				points += 1;
			} else {
				correctAnswers.push("white")
			}
		}
		console.log("Guessed answers", payload.colors)
		console.log("Correct Answers", this.answer)
		console.log("Answers:", correctAnswers)
		const winner = correctAnswers.every(color => color === "black", correctAnswers)
		const validationPayload: validationAnswer = {
			success: winner,
			answers: correctAnswers,
			totalPoints: points,
			playerId: payload.playerId,
		}
		return validationPayload;
	}
}