<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Home from './views/home.vue';

export default defineComponent({
  name: 'App',
  components: {
    Home
  }
});
</script>

<style lang="scss">
@import url(./assets/font/iconfont.css);

.iconfont {
  font-family: "iconfont", serif !important;
  font-style: normal;
  font-size: 25px;
  vertical-align: middle;
  color: rgb(117, 120, 137);
  transition: .3s;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  padding: 0;
  margin: 0;
}

#app {
  width: 100vw;
  height: 100vh;
  background-color: rgb(151, 157, 167);
}
</style>
