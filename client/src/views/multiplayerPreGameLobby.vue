<template>
  <div id="lobby">
    <div class="container">
      <div class="card">
        <div class="card-title">
          <button class="secondary" v-on:click.self="leaveGame()">Leave</button>
          <h3>Pre game lobby</h3>
        </div>
        <div class="card-body">
          <p>Host: {{ gameObject.hostPlayer }}</p>
          <p>
            Connected players: {{ numberOfPlayers }}/{{ gameObject.maxPlayers }}
          </p>
          <p>Max players: {{ gameObject.maxPlayers }}</p>
        </div>
        <div class="card-footer">
          <button
            v-if="playerId == gameObject.hostPlayer"
            v-on:click.self="startGame()"
          >
            Start
          </button>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h3>Players</h3>
		  <div
            class="row"
            v-for="(n, i) in gameObject.connectedPlayers"
            :key="n"
          >
            <div>
              <p>
                {{ gameObject.connectedPlayers[i].username }} |
                {{
                  !gameObject.connectedPlayers[i].ready ? "Not ready" : "Ready"
                }}
              </p>
              <button
                v-if="playerId == n.playerId"
                v-on:click.self="readyUp(!gameObject.connectedPlayers[i].ready)"
              >
                {{
                  !gameObject.connectedPlayers[i].ready ? "Ready" : "Unready"
                }}
              </button>
              <button
                v-if="playerId == gameObject.hostPlayer"
                v-on:click.self="kickPlayer(n.playerId)"
              >
                Kick
              </button>
            </div>
          </div>
        </div>
        <div class="card-footer">

        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import multiplayerGameView from "./multiplayerGameView.vue";
import { socket } from "../api/socketConnection";
import { gameObject } from "../interface/interface";

export default defineComponent({
  name: "multiplayerPreGameLobby",
  components: {
    multiplayerGameView,
  },
  data() {
    return {
      playerId: "",
      id: this.$route.params.slug,
      gameObject: {},
      numberOfPlayers: 0,
    };
  },
  methods: {
    startGame() {
      socket.emit("startGame", this.id, () => {
        this.$router.push("/multiplayer/game/" + this.id);
      });
    },
    kickPlayer(targetPlayerId: string) {
      socket.emit("kicked", this.id, targetPlayerId, (gameUpdate: any) => {
        this.gameObject = gameUpdate;
      });
    },
    leaveGame() {
      socket.emit("leaveMultiplayerGame", this.id, this.playerId);
      this.$router.push("/");
    },
    readyUp(readyState: boolean) {
      socket.emit(
        "readyUpPlayer",
        this.id,
        this.playerId,
        readyState,
        (gameUpdate: any) => {
          this.gameObject = gameUpdate;
        }
      );
    },
  },
  created() {
    socket.on("startGame", () => {
      this.$router.push("/multiplayer/game/" + this.id);
    });
    socket.on("IGotKicked", () => {
      this.$router.push("/");
    });
    socket.emit("getMultiplayerGameInformation", this.id);
    socket.on("updateGameInfo", (gameInformation: gameObject) => {
      this.gameObject = gameInformation;
      this.numberOfPlayers = gameInformation.connectedPlayers.length;
    });
    socket.emit("getClientId", (id: string) => {
      this.playerId = id;
    });
  },
});
</script>
<style lang="scss" scoped>
#lobby {
  display: flex;
  align-items: center;
  height: 100%;
  .container {
    display: grid;
    grid-template-columns: 440px 300px;
    gap: 16px;
    width: 100%;
    margin: 0 auto;
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
</style>