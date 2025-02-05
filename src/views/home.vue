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

<script setup>
import { computed } from 'vue';
import Nav from "@/views/components/Nav.vue";
import store from "@/vuex/store.js";

// Computed property for switchState
const switchState = computed(() => store.state.switchState);
</script>

<style lang="scss" scoped src="./home.scss"/>
