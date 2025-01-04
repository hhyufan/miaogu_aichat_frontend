<template>
  <el-container class="home" >
    <el-aside width="100px" style="position: fixed; top: 2%;left: 0; height: 60%; z-index: 10;">
      <Nav></Nav>
    </el-aside>
    <el-main style="margin-left: 100px; top: 5%;">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent } from 'vue';
import Nav from "@/views/components/Nav.vue";

export default defineComponent({
    name: "App",
    components: {
        Nav,
    },
});
</script>

<style lang="scss" scoped>
.home {
    width: 90vw;
    height: 90vh;
    background-color: rgba(255, 255, 255, 0.76);
    border-radius: 15px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
