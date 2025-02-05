<template>
  <div class="nav" v-if="userName">
    <div class="own-pic">
      <HeadPortrait :imgUrl="imgUrl" />
    </div>
    <div class="nav-menu-wrapper">
      <ul class="menu-list">
        <li v-for="(item, index) in menuList" :key="index" :ref="el => menuRefs[index] = el" @click="changeMenu(index)">
          <div :class="['block', `block-color${switchState ? 'A' : 'B'}`]"></div>
          <span :class="['iconfont', item, `iconfont-color${switchState ? 'A' : 'B'}`]"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import HeadPortrait from "./HeadPortrait.vue";
import headPortrait_img from '@/assets/img/head_portrait.jpg';
import store from "@/vuex/store.js";

// Computed properties
const userName = computed(() => !!store.state.UserName);
const switchState = computed(() => store.state.switchState);

// Refs
const menuRefs = ref([]);
const router = useRouter();
const menuList = ref(["icon-aichat", "icon-setting"]);
const imgUrl = ref(headPortrait_img);

// Methods
const changeMenu = (index) => {
  switch (index) {
    case 0:
      router.push({ name: "ChatHome" });
      break;
    case 1:
      router.push({ name: "Setting" });
      break;
    default:
      router.push({ name: "ChatHome" });
  }
  // Access corresponding block elements
  menuRefs.value.forEach((_, i) => {
    const blockElement = menuRefs.value[i].querySelector('.block');
    blockElement.style.opacity = i === index ? '1' : '0';
  });
};
</script>

<style lang="scss" scoped src="./nav.scss"/>
