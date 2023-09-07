<template>
  <div id="app">
    <fiveChess />
  </div>
</template>

<script>
import fiveChess from './views/fiveChess/fiveChess.vue'
import {  disconnect, initSocket } from '@/service/socket';
export default {
  name: 'App',
  components: {
    fiveChess
  },
  mounted(){
    initSocket()
  },
  beforeDestroy() {
    //断开连接
    disconnect()
    $game_bus.$off()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
