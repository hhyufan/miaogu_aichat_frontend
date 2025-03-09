<template>
  <div id="app">
    <Home />
  </div>
</template>

<script setup>
import Home from './views/home.vue';
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
  box-sizing: border-box;
}

#app {
  user-select: none;
  width: 100vw;
  height: 100vh;
  background-color: rgb(151, 157, 167);
  display: flex;
  justify-content: center;
  align-items: center;
}
.global-toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;
}

.toast-item {
  padding: 12px 20px;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 3px 12px rgba(0,0,0,0.15);
  margin-bottom: 10px;
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.3s, transform 0.3s;
}

.toast-item.show {
  opacity: 1;
  transform: translateY(0);
}
</style>
