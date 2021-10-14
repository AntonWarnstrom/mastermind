<template>
  <multiplayerGame
    :gameId="gameObject.gameId"
    :positions="gameObject.positions"
    :tries="gameObject.tries"
    :colorList="gameObject.colorList"
	:maxPlayers="gameObject.maxPlayers"
	:playerCount="playerCount"
  ></multiplayerGame>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import multiplayerGame from "../components/multiplayerGame.vue";
import { socket } from "../api/socketConnection";
export default defineComponent({
  name: "multiplayerGameView",
  components: {
    multiplayerGame,
  },
  data() {
    return {
      id: this.$route.params.slug,
      gameObject: {},
	  playerCount: 0
    };
  },
  created() {
	  console.log("test")
    socket.emit("getMultiplayerGameInformation", this.id);
    socket.on("updateGameInfo", (gameInformation: any) => {
      this.gameObject = gameInformation;
	  this.playerCount = gameInformation.connectedPlayers.length
    });
  },
});
</script>