<template>
  <!--{{ gameObject }}-->
  <singleplayerGame
    :gameId="gameObject.gameId"
    :positions="gameObject.positions"
    :tries="gameObject.tries"
    :colorList="gameObject.colorList"
  ></singleplayerGame>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import singleplayerGame from "../components/singleplayerGame.vue";
import { socket } from "../api/socketConnection";
export default defineComponent({
  name: "singleplayerGameView",
  components: {
    singleplayerGame,
  },
  data() {
    return {
      id: this.$route.params.slug,
      gameObject: {},
    };
  },
  created() {
    socket.emit("getSingleplayerGameInformation", this.id);
    socket.on("gameInformation", (gameInformation: any) => {
      this.gameObject = gameInformation;
      console.log(
        gameInformation.tries,
        gameInformation.positions,
        gameInformation.colorList
      );
    });
  },
});
</script>