<template>
  <div class="container">
    <div class="container-wrap">
      <div class="row">
        <div v-if="winner">
          <game-completed
            :gameId="gameId"
            :winner="winner"
            :tries="turn"
          ></game-completed>
        </div>
        <div class="card">
          <div class="card-title">
            <h2>Singleplayer</h2>
            <p>Turn: {{ turn }}/{{ tries }}</p>
          </div>
          <div class="card-body">
            <div class="row" v-for="(n, index) in tries" ref="row" :key="n">
              <div class="answer">
                <div
                  class="answerBox"
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
                <div v-if="chooseColor" class="colors">
                  <button
                    v-for="n in colorList"
                    :key="n"
                    :id="n"
                    v-on:click="selectColor(n)"
                    :style="{
                      backgroundColor: n,
                    }"
                  >
                    <!--{{ colorList[l] }}-->
                  </button>
                </div>
                <button
                  class="button"
                  v-for="(n, i) in positions"
                  :key="n"
                  :disabled="index != turn"
                  :style="{
                    backgroundColor:
                      index > turn ? '#aeb6b8' : history[index].colors[i],
                  }"
                  v-on:click.self="changeToSelectedColor(index, i)"
                >
                  <!--{{ i }}, {{ index }},-->
                </button>
                <!--{{ history[index] }}-->
              </div>
            </div>
          </div>
          <div class="card-footer row">
            <button v-on:click="makeGuess()">Guess</button>
            <button v-on:click.self="leaveGame()">Leave</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  singleplayerGameInterface,
  validationAnswer,
} from "../interface/interface";
import { socket } from "../api/socketConnection";
import gameCompleted from "./gameCompleted.vue";

export default defineComponent({
  components: { gameCompleted },
  name: "singleplayerGame",
  props: {
    positions: Number,
    tries: Number,
    colorList: Array,
    gameId: String,
  },
  data(): singleplayerGameInterface {
    return {
      history: [
        {
          colors: [],
          answers: [],
        },
      ],
      winner: false,
      turn: 0,
      selectedColor: "",
      chooseColor: false,
      activeRow: 0,
      activePosition: 0,
    };
  },
  created() {
    socket.on("answers", (colorAnswer: validationAnswer) => {
      this.history[this.turn].answers = colorAnswer.answers;
      this.winner = colorAnswer.success;
      this.turn++;
    });
  },
  methods: {
    leaveGame() {
      socket.emit("leaveSingleplayerGame", this.gameId);
      this.$router.push("/");
    },
    makeGuess() {
      console.log(this.turn);
      const colors = this.history[this.turn].colors;
      const guess = {
        gameId: this.gameId,
        colors: colors,
      };
      socket.emit("validateSingleplayerGuess", guess);
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
      console.log(this.activePosition, this.activeRow, this.chooseColor);
    },
  },
});
</script>
<style scoped>
.container-wrap {
  display: flex;
  justify-content: center;
}
.row > .answer {
  display: flex;
  flex-wrap: wrap;
}
.card-body {
  overflow: scroll;
  overflow-x: hidden;
  height: 600px;
}
.answerBox {
  background-color: white;
  border-radius: 50%;
  margin: 1px;
  width: 10px;
  height: 10px;
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
.guess > .button:disabled {
  border: none;
  cursor: default;
}
.button {
  cursor: pointer;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: var(--primary-card-background);
  border: 1px solid var(--primary-button-hover);
  margin: 5px;
}
</style>