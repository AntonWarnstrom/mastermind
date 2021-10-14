<template>
  <div id="home">
    <div class="container">
      <div class="card">
        <div class="card-title">
          <h3>Create Game</h3>
        </div>
        <div class="card-body">
          <form class="input-group" v-on:submit.prevent>
            <div class="column">
              <label>Colors</label>
              <input
                name="colors"
                class="colors"
                placeholder="(default 4)"
                v-model.number="colors"
              />
              <label>Tries </label>
              <input
                name="tries"
                class="tries"
                placeholder="(default 10)"
                v-model.number="tries"
              />
              <label>Players </label>
              <input
                name="maxPlayers"
                class="maxPlayers"
                placeholder="(default 4)"
                v-model.number="maxPlayers"
              />
              <button
                v-on:click="
                  createMultiplayerGame(
                    this.maxPlayers,
                    this.colors,
                    this.tries
                  )
                "
              >
                Create game
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          <h3>Multiplayer games</h3>
        </div>
        <div class="card-body">
          <div v-if="games.length != 0" class="column">
            <button
              class="button item"
              v-for="(n, i) in games"
              :key="n"
              :disabled="n.playerCount == n.maxPlayerCount"
              v-on:click.self="joinMultiplayerGame(n.id)"
            >
              Join game {{ i + 1 }} - {{ n.playerCount }}/{{ n.maxPlayerCount }}
            </button>
          </div>
          <div v-else>No active games</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { gameInterface } from "@/interface/interface";
import { defineComponent } from "vue";
import { socket } from "../api/socketConnection";

export default defineComponent({
  name: "Home",
  data(): gameInterface {
    return {
      colors: 4,
      tries: 10,
      maxPlayers: 4,
      games: [],
    };
  },
  created() {
    socket.emit("multiplayerGames", (games: []) => {
      this.games = games;
    });
    socket.on("getMultiplayerGames", (games: []) => {
      this.games = games;
    });

    socket.on("createAndJoinSingleplayerGame", (gameObject: any) => {
      this.$router.push("/singleplayer/" + gameObject.gameId);
    });

    socket.on("createMultiplayerGame", (gameObject: any) => {
      this.games.push(gameObject.gameId);
    });

    socket.on("joinMultiplayerGame", (gameObject: any) => {
      this.$router.push("/multiplayer/lobby/" + gameObject.gameId);
    });
  },
  methods: {
    createSingleplayerGame(positions: number, tries: number) {
      const payload = {
        positions: positions === null ? 4 : positions,
        tries: tries === null ? 10 : tries,
      };
      socket.emit("singleplayer", payload);
    },
    createMultiplayerGame(
      maxPlayers: number,
      positions: number,
      tries: number
    ) {
      const payload = {
        maxPlayers: !maxPlayers ? 4 : maxPlayers,
        positions: !positions ? 4 : positions,
        tries: !tries ? 10 : tries,
      };
      socket.emit("multiplayer", payload, (gameId: string) => {
        this.$router.push("/multiplayer/lobby/" + gameId);
      });
    },
    joinMultiplayerGame(gameId: string) {
      socket.emit("joinMultiplayer", gameId);
      this.$router.push("/multiplayer/lobby/" + gameId);
    },
  },
});
</script>
<style lang="scss" scoped>
#home {
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
input {
  margin-top: 6px;
  margin-bottom: 16px;
  max-width: 100%;
  -webkit-box-flex: 1;
  -ms-flex: 1 0 auto;
  flex: 1 0 auto;
  outline: 0;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  text-align: left;
  padding: 10px;
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--primary-text);
  border-radius: 6px;
}

input:active,
input:focus {
  border-color: var(--primary-button);
}
button:disabled {
  cursor: default;
  background-color: var(--primary-button);
}
.column {
  display: flex;
  flex-direction: column;
}
.row {
  justify-content: space-evenly;
}
.input-group > label {
  margin-right: 1em;
}
.item {
  margin: 5px 0 5px 0;
}
</style>