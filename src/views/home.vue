<template>
  <el-container :class="['home',`home-color${switchState ? 'A' : 'B'}`]" v-if="true">
    <el-aside width="100px" style="position: fixed; top: 2%;left: 0; height: 60%; z-index: 10;">
      <Nav></Nav>
    </el-aside>
    <el-main style="margin-left: 100px; top: 5%; max-width: 96%">
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
import {computed, defineComponent} from 'vue';
import Nav from "@/views/components/Nav.vue";
import store from "@/vuex/store.js";


export default defineComponent({
    name: "App",
    setup() {
      const switchState = computed(() => store.state.switchState);
      return {
      switchState
    }
  },
    components: {
        Nav,
    },
});
</script>

<style lang="scss" scoped>
.home-colorA {
  background: linear-gradient(200deg, rgb(249, 248, 251), rgb(222, 213, 246));
}
.home-colorB {
  background: linear-gradient(200deg, rgb(249, 248, 251), rgb(243, 246, 208));
}
.home {
    width: 90vw;
    height: 90vh;
    border-radius: 15px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
