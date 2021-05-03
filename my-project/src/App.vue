<template>
  <div id="app">
    <Browser />
    <HelloReact />
  </div>
</template>

<script>
import Browser from './components/kg-browser'
import HelloReact from './components/HelloReact'

export default {
  name: 'App',
  components: {
    Browser,
    HelloReact
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
