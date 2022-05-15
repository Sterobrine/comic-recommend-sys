<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import MainFrame from './components/MainFrame.vue'

export default {
  name: 'App',
  components:{
    MainFrame
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
