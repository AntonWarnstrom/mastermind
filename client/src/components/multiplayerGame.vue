<template>
  <div id="game">
    <div v-if="winner || turn == tries">
      <game-completed
        :gameId="gameId"
        :winner="winner"
        :tries="turn"
      ></game-completed>
    </div>
    <div class="container">
      <div class="card">
        <div class="card-title">
          <button class="secondary" v-on:click.self="leaveGame()">Leave</button>
          <h2>Mastermind</h2>
        </div>
        <div class="card-body">
          <div class="guess-row" v-for="(n, index) in tries" ref="row" :key="n">
            <div class="answer">
              <div
                class="answerBox fixed"
                v-for="(n, k) in positions"
                :key="n"
                disabled
                :style="{
                  backgroundColor:
                    index > turn ? 'white' : history[index].answers[k],
                }"
              ></div>
            </div>
            <div class="guess">
              <Popper placement="top" :interactive="false">
                <button
                  class="button"
                  v-for="(n, i) in positions"
                  :key="n"
                  :disabled="index != turn"
                  :style="{
                    backgroundColor: index <= turn && history[index].colors[i],
                  }"
                  v-on:click.self="changeToSelectedColor(index, i)"
                ></button>
                <template #content>
                  <div class="colors">
                    <button
                      v-for="n in colorList"
                      :key="n"
                      :id="n"
                      v-on:click="selectColor(n)"
                      :style="{
                        backgroundColor: n,
                      }"
                    ></button>
                  </div>
                </template>
              </Popper>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="guess-button" v-on:click="makeGuess()">Guess</button>
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          <p>Turn: {{ turn }}/{{ tries }}</p>
          <p>Connected players: {{ playerCount }}/{{ maxPlayers }}</p>
        </div>
        <div class="card-body">
          <div class="guess-row" v-for="n in scores" :key="n">
            <div class="score">
              <div
                class="answerBox"
                style="cursor: default"
                disabled
                v-for="color in n.answers"
                :key="color"
                :style="{
                  backgroundColor: index > turn ? 'white' : color,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  multiplayerGameInterface,
  validationAnswer,
} from "../interface/interface";
import { socket } from "../api/socketConnection";
import gameCompleted from "./gameCompleted.vue";
import gameLost from "./gameLost.vue";
import Popper from "vue3-popper";

export default defineComponent({
  name: "multiplayerGame",
  components: {
    gameCompleted,
    gameLost,
    Popper,
  },
  props: {
    positions: Number,
    tries: Number,
    colorList: Array,
    gameId: String,
    maxPlayers: Number,
    playerCount: Number,
  },
  data(): multiplayerGameInterface {
    return {
      index: 0,
      history: [
        {
          colors: [],
          answers: [],
        },
      ],
      winner: false,
      turn: 0,
      chooseColor: false,
      selectedColor: "",
      activeRow: 0,
      activePosition: 0,
      scores: [],
      playerId: "",
    };
  },
  created() {
    socket.emit("getClientId", (id: string) => {
      this.playerId = id;
    });

    socket.on("answers", (colorAnswer: validationAnswer) => {
      console.log(this.turn);
      this.history[this.turn].answers = colorAnswer.answers;
      this.winner = colorAnswer.success;
      this.turn++;
    });

    socket.on("listScores", (scores: validationAnswer[]) => {
      this.scores = scores;
    });
  },
  unmounted() {
    (socket as any).removeAllListeners();
  },
  methods: {
    leaveGame() {
      socket.emit("leaveMultiplayerGame", this.gameId, this.playerId);
      this.$router.push("/");
    },
    makeGuess() {
      const colors = this.history[this.turn].colors;
      const guess = {
        gameId: this.gameId,
        playerId: this.playerId,
        colors: colors,
      };
      socket.emit("validateMultiplayerGuess", guess);
    },
    selectColor(color: string) {
      this.selectedColor = color;
      this.history[this.activeRow + 1] = { colors: [], answers: [] };
      this.history[this.activeRow].colors[this.activePosition] =
        this.selectedColor;
      this.chooseColor = false;
    },
    changeToSelectedColor(row: number, position: number) {
      this.chooseColor = true;
      this.activeRow = row;
      this.activePosition = position;
    },
  },
});
</script>
<style lang="scss" scoped>
#game {
  display: flex;
  align-items: center;
  min-height: 100vh;
  .container {
    display: grid;
    grid-template-columns: 440px 300px;
    gap: 16px;
    width: 100%;
    margin: 96px auto;
    justify-content: center;
    @media screen and (max-width: 840px) {
      grid-template-columns: 100%;
      padding: 16px;
    }
    .card {
      width: 100%;
    }
  }
}
.guess-row {
  display: flex;
  align-items: center;
  margin: 16px 0;
  .answer {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: 1fr 1fr;
    column-gap: 2px;
    row-gap: 2px;
    margin-right: 16px;
  }
  .guess {
    width: 100%;
  }
}

.card-body {
  overflow: scroll;
  overflow-x: hidden;
  height: 50vh;
}
.answerBox {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  padding-top: 100%;
  &.fixed {
    padding-top: 0;
    width: 16px;
    height: 16px;
  }
}
.score {
  width: 100%;
  display: grid !important;
  grid-auto-flow: column;
  column-gap: 8px;
}
.colors > button {
  margin: 5px;
  border: none;
  background: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
}

.guess-button {
  width: 100%;
}

.button {
  display: flex;
  position: relative;
  border-radius: 50%;
  padding: 0;
  padding-top: 100%;
  cursor: pointer;
  background-color: var(--primary-card-background);
  border: 1px solid var(--border-color);
  &:hover {
    border: 1px solid var(--primary-button);
  }
}
</style>
<style lang="scss">
.inline-block:not(.popper) {
  width: 100%;
  display: grid !important;
  grid-auto-flow: column;
  column-gap: 8px;
  .button:disabled {
    background-color: var(--border-color);
    border: none;
    cursor: default;
  }
}
</style>