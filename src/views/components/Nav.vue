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
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import HeadPortrait from "./HeadPortrait.vue";
import headPortrait_img from '@/assets/img/head_portrait.jpg';
import store from "@/vuex/store.js";

// Computed properties
const userName = computed(() => !!store.state.UserName);
const switchState = computed(() => store.state.switchState);
const menuState = computed(() => store.state.menuState);
// Refs
const menuRefs = ref([]);
const router = useRouter();
const menuList = ref(["icon-aichat", "icon-setting"]);
const imgUrl = ref(headPortrait_img);

onMounted(() => updateBlockElement(menuState.value));

watch(menuState, () => updateBlockElement(menuState.value), { immediate: true });

function updateBlockElement(value) {
  menuRefs.value.forEach((_, i) => {
    const blockElement = menuRefs.value[i].querySelector('.block');
    blockElement.style.opacity = i === value ? '1' : '0';
  });
}

// Methods
const changeMenu = (index) => {
  switch (index) {
    case 0:
      router.push({ name: "ChatHome" });
      store.dispatch('updateMenuState', 0);
      break;
    case 1:
      router.push({ name: "Setting" });
      store.dispatch('updateMenuState', 1);
      break;
    default:
      store.dispatch('updateMenuState', 0);
      router.push({ name: "ChatHome" });
  }
};
</script>

<style lang="scss" scoped src="./nav.scss" />
