import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Home = () => import(/* webpackChunkName: "game" */ '../views/Home.vue')
const singleplayerGameView = () => import(/* webpackChunkName: "game" */ '../views/singleplayerGameView.vue')
const multiplayerGameView = () => import(/* webpackChunkName: "game" */ '../views/multiplayerGameView.vue')
const multiplayerPreGameLobby = () => import(/* webpackChunkName: "game" */ '../views/multiplayerPreGameLobby.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/singleplayer/:slug',
    name: 'singleplayer',
    component: singleplayerGameView
  },
  {
    path: '/multiplayer/game/:slug',
    name: 'multiplayerGame',
    component: multiplayerGameView
  },
  {
    path: '/multiplayer/lobby/:slug',
    name: 'multiplayerLobby',
    component: multiplayerPreGameLobby
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
