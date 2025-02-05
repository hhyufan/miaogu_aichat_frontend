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

<style lang="scss" scoped src="./headPortrait.scss"/>
