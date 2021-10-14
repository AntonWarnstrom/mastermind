<template>
  <div class="card">
    <div class="card-title">
      <h3>
      </h3>
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
    <div class="card-footer"></div>
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
<style scoped>
.gameCompleted {
  width: 100%;
  margin: 5px;
  padding: 5px;
  border-radius: 10px;
  background-color: #aeb6b8;
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