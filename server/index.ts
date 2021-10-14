import { Singleplayer } from "./gamemodes/singleplayer";
import { Multiplayer } from "./gamemodes/multiplayer";
import { genUniqueId, genUniqueName } from "./utils/utils"
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { player, guessValidation, multiplayerConfig, singleplayerGameOption } from "./types/types";

const PORT = 8081
const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: true,
		methods: ["GET", "POST"],
	}
})


let singleplayerGames = new Map<String | String[], Singleplayer>();
let multiplayerGames = new Map<String | String[], Multiplayer>();

function getGames(games: Map<String | String[], Multiplayer>) {
	let test = Array.from(games.keys())
	console.log(test)
	let gameList = new Array();
	test.forEach((item) => {
		const gameObject = multiplayerGames.get(item);
		const payload = {
			id: item,
			gameStatus: gameObject?.active,
			playerCount: gameObject?.connectedPlayers.length,
			maxPlayerCount: gameObject?.maxPlayers,
		}
		gameList.push(payload)
	})
	return gameList;
};

io.on('connection', (socket: Socket) => {
	socket.join("lobby")
	console.log(socket.id + " connected")
	socket.to("lobby").emit("getMultiplayerGames", getGames(multiplayerGames));

	socket.on('singleplayer', (payload: singleplayerGameOption) => {
		const game = new Singleplayer(genUniqueId(), payload.positions, payload.tries)
		socket.emit("createAndJoinSingleplayerGame", game)
		singleplayerGames.set(game.gameId, game)
	});

	socket.on('multiplayer', (payload: multiplayerConfig, callback) => {
		console.log(payload)
		const game = new Multiplayer(socket.id + genUniqueId(), socket.id, payload.maxPlayers, payload.positions, payload.tries, false)
		console.log()
		const player: player = {
			username: genUniqueName(),
			playerId: socket.id,
			ready: true,
		}
		game.connectedPlayers.push(player)
		multiplayerGames.set(game.gameId, game)
		socket.join(game.gameId)
		socket.to("lobby").emit("getMultiplayerGames", getGames(multiplayerGames))
		callback(game.gameId)
	});

	socket.on('joinMultiplayer', (gameId: string) => {
		const player: player = {
			username: genUniqueName(),
			playerId: socket.id,
			ready: false,
		}
		const gameObject = multiplayerGames.get(gameId)
		if (gameObject?.connectedPlayers.length != gameObject?.maxPlayers) {
			gameObject?.connectedPlayers.push(player)
			socket.to(gameId).emit('updateGameInfo', gameObject);
			socket.leave("lobby");
			socket.join(gameId);
		} else {
			socket.emit('lobbyFull');
		}
	});

	socket.on('validateSingleplayerGuess', (payload: guessValidation) => {
		const game = singleplayerGames.get(payload.gameId)
		let answers = game?.validateGuess(payload)
		socket.emit("answers", answers)
	});

	socket.on('validateMultiplayerGuess', (payload: guessValidation) => {
		console.log(payload)
		const game = multiplayerGames.get(payload.gameId)
		const answers = game?.validateGuess(payload)
		if (game?.scores && answers) {
			const elementIndex = game?.scores.findIndex(Player => Player.playerId === payload.playerId) as number;
			console.log("index: ", elementIndex)
			if (elementIndex == -1) {
				game.scores.push(answers);
			}
			else if (game.scores[elementIndex].totalPoints < answers.totalPoints) {
				game.scores[elementIndex] = answers;
			}
		}
		console.log("Scores: ", game?.scores)
		io.in(payload.gameId).emit("listScores", game?.scores);
		socket.emit("answers", answers);
	});

	socket.on("multiplayerGames", (callback) => {
		let gameList = getGames(multiplayerGames)
		io.in("lobby").emit("getMultiplayerGames", gameList)
		callback(gameList)
	});

	socket.on('getSingleplayerGameInformation', (gameId: string) => {
		const gameObject = singleplayerGames.get(gameId)
		socket.emit("gameInformation", gameObject)
	});

	socket.on('getMultiplayerGameInformation', (gameId: string) => {
		const gameObject = multiplayerGames.get(gameId)
		socket.emit("updateGameInfo", gameObject)
	});

	socket.on("getAnswerFromGame", (gameId: string) => {
		const gameObject = singleplayerGames.get(gameId);
		socket.emit("getAnswer", gameObject?.getColorAnswer());
	});

	socket.on("getMultiplayerColorAnswer", (gameId: string, callback) => {
		const gameObject = multiplayerGames.get(gameId);
		callback(gameObject?.getColorAnswer())
	});

	socket.on("getClientId", (callback) => {
		callback(socket.id)
	});

	socket.on("startGame", (gameId: string, callback) => {
		let gameObject = multiplayerGames.get(gameId);
		if (gameObject) {
			gameObject.active = true;
			gameObject?.connectedPlayers.forEach((item: player, index, array) => {
				if (item.ready == false && item.playerId) {
					array.splice(index, 1)
					socket.to(item.playerId).socketsLeave(gameId)
					socket.to(item.playerId).socketsJoin("lobby")
					socket.to(item.playerId).emit("IGotKicked")
				}
			})
		}
		socket.in("lobby").emit("getMultiplayerGames", getGames(multiplayerGames))
		socket.in(gameId).emit('updateGameInfo', gameObject);
		socket.in(gameId).emit('startGame');
		callback();
	})

	socket.on("readyUpPlayer", (gameId: string, playerId: string, readyState: boolean, callback) => {
		let gameObject = multiplayerGames.get(gameId);
		const elementIndex = gameObject?.connectedPlayers.findIndex(Player => Player.playerId === playerId) as number;
		if (gameObject) {
			gameObject.connectedPlayers[elementIndex].ready = readyState
		}
		console.log(gameObject)
		socket.in(gameId).emit('updateGameInfo', gameObject);
		callback(gameObject);
	});

	socket.on("leaveSingleplayerGame", (gameId: string) => {
		singleplayerGames.delete(gameId);
	})

	socket.on("leaveMultiplayerGame", (gameId: string, playerId: string) => {
		let gameObject = multiplayerGames.get(gameId);
		gameObject?.connectedPlayers.splice(gameObject?.connectedPlayers.map(function (e) { return e.playerId; }).indexOf(playerId), 1);
		if (gameObject?.connectedPlayers.length == 0) {
			multiplayerGames.delete(gameId);
			const games = Array.from(multiplayerGames.keys());
			socket.to("lobby").emit("getMultiplayerGames", games)
		}
		socket.to(gameId).emit('updateGameInfo', gameObject);
		socket.leave(gameId)
		socket.join("lobby")
	});
	socket.on("kicked", (gameId: string, playerId: string, callback) => {
		let gameObject = multiplayerGames.get(gameId);
		gameObject?.connectedPlayers.splice(gameObject?.connectedPlayers.map(function (e) { return e.playerId; }).indexOf(playerId), 1);
		socket.to(playerId).socketsLeave(gameId)
		socket.to(playerId).socketsJoin("lobby")
		socket.to(playerId).emit("IGotKicked")
		socket.in(gameId).emit('updateGameInfo', gameObject);
		callback(gameObject);
	})
	socket.on("leaveSingleplayerGame", (gameId: string, _playerId: string) => {
		singleplayerGames.delete(gameId);
	});
});

httpServer.listen(PORT, () => {
	console.log("Listening to port: " + PORT)
});

