<template>
  <div class="person-card" :class="[`hover-${switchState ? 'a' : 'b'}`, {[`active-card${switchState ? 'A' : 'B'}`]: personInfo['id'] === current, activeCard: personInfo['id'] === current }]" @click="handleClick">
    <div class="info">
      <HeadPortrait :imgUrl="avatarUrl" />
      <div class="info-detail">
        <div :class="[`name-color${switchState ? 'A' : 'B'}`,'name']">{{ personInfo['name'] }}</div>
        <div class="detail">{{ personInfo['detail'] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, watch,  computed} from 'vue';
import HeadPortrait from "./HeadPortrait.vue";
import defaultHeadImg from "@/assets/img/head_portrait.jpg";
import avatarGPT3_5 from "@/assets/img/head_portrait1.jpg"; // 导入头像 GPT3_5
import avatarGPT4 from "@/assets/img/head_portrait2.jpg";
import avatarDeepSeek from "@/assets/img/head_portrait3.jpg"; // Import avatar for GPT4
import store from "@/vuex/store.js"; // 导入头像 GPT4
export default defineComponent({
  props: {
    personInfo: {
      type: Object,
      default: () => ({})
    },
    pcCurrent: {
      type: String,
      default: ''
    }
  },
  components: {
    HeadPortrait,
  },
  setup(props, { emit }) {  // 这里的 emit 是通过第二个参数传入的
    const getAvatar = (role) => {
      switch (role) {
        case '1002':
          return avatarGPT3_5; // 返回 GPT3_5 的头像
        case '1003':
          return avatarGPT4; // 返回 GPT4 的头像
        case '1004':
          return avatarDeepSeek; // 返回 GPT4 的头像
        default:
          return defaultHeadImg; // 默认头像
      }
    };
    const switchState = computed(() => store.state.switchState);
    const current = ref('');
    const avatarUrl = ref(defaultHeadImg);

    watch(() => props.pcCurrent, () => {
      isActive();
    });

    const isActive = () => {
      current.value = props.pcCurrent;
    };

    // 监听 personInfo 的变化，更新头像
    watch(() => props.personInfo.id, (newId) => {
      avatarUrl.value = getAvatar(newId); // 根据 personInfo.id 更新头像
    }, { immediate: true }); // 在组件挂载时立即执行一次

    const handleClick = () => {
      // Emit an event to the parent component
      emit('click', props.personInfo); // 使用 emit 而不是 this.$emit
    };

    return {
      current,
      isActive,
      handleClick,
      avatarUrl,
      switchState
    };
  }
});
</script>

<style lang="scss" scoped src="./personalCard.scss"/>
