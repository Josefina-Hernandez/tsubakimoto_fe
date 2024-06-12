<template>
  <!--<nav>
    <router-link to="/">Home</router-link>
    <router-link to="/">Login</router-link> |
    <router-link to="/about">About</router-link>
  </nav>-->
  <router-view/>
</template>

<script>

export default {
  name: 'HomeView',
  mounted() {
    document.title = 'Hello world!!!';
  },
}
</script>

<style lang="less">
html {
  zoom: 90% !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
