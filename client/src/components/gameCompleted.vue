<template>
  <div class="card game-completed">
    <div class="card-title">
      <h3 v-if="winner">You won!</h3>
      <h3 v-else>You lost!</h3>
    </div>
    <div class="card-body">
      <p>Correct colors:</p>
      <div class="row">
        <div class="correctColors">
          <div
            class="colorAnswer"
            v-for="n in colorAnswer"
            :key="n"
            :style="{
              backgroundColor: n,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { socket } from "../api/socketConnection";
export default defineComponent({
  name: "gameCompleted",
  props: {
    tries: Number,
    winner: Boolean,
    gameId: String,
  },
  data() {
    return {
      colorAnswer: [],
    };
  },
  created() {
    socket.emit("getMultiplayerColorAnswer", this.gameId, (colors: any) => {
      this.colorAnswer = colors;
    });
  },
  methods: {
    leaveGame(gameId: String | string[]) {
      socket.emit("leaveSingleplayerGame", gameId);
      this.$router.push("/");
    },
  },
});
</script>
<style lang="scss" scoped>
.game-completed {
  z-index: 3;
  position: fixed;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  left: 50%;
  width: 400px;
  text-align: center;
  .card-title, h3 {
    width: 100%;
  }
}

.leaveGame {
  float: right;
  cursor: pointer;
  color: white;
  height: 25px;
  width: 75px;
  border-radius: 5%;
  background-color: #33cc99;
  border: none;
}
.correctColors {
  display: flex;
  justify-content: center;
  flex-direction: row;
}
.colorAnswer {
  cursor: pointer;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  margin: 5px;
}
</style>