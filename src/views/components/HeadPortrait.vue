<template>
  <div class="head-portrait">
    <img :src="imgUrl" alt="" />
  </div>
</template>

<script setup>
import headPortrait from '@/assets/img/head_portrait.jpg';

// 定义 props
defineProps({
  imgUrl: {
    type: String,
    default: () => headPortrait
  }
});
</script>

<style lang="scss" scoped>
.head-portrait {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid rgb(255, 255, 255);
    position: relative;

    img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        box-sizing: border-box;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        vertical-align: middle;
    }
}
</style>
