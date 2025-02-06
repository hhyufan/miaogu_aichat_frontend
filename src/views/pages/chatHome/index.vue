<template>
  <div class="chatHome">
    <div class="chatLeft">
      <div :class="[`title-color${store.state.switchState ? 'A' : 'B'}`,'title']">
        <h1>喵咕聊天室</h1>
      </div>
      <div class="online-person">
        <div class="person-cards-wrapper">
          <div class="personList" v-for="personInfo in personList" :key="personInfo.id"
               @click="clickPerson(personInfo)">
            <PersonCard :personInfo="personInfo" :pcCurrent="pcCurrent" @click="clickPerson" />
          </div>
        </div>
      </div>
    </div>
    <div class="chatRight">

      <div v-if="showChatWindow">
        <ChatWindow :friendInfo="chatWindowInfo" @personCardSort="personCardSort" />
      </div>
      <div class="showIcon" v-else>
        <img class="icon-snapchat" :src="currentIcon" alt="" @error="handleImageError" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex'; // 导入 Vuex 的 useStore
import PersonCard from "@/views/components/PersonalCard.vue";
import ChatWindow from "./chatwindow.vue";
import { getFriend } from "@/api/getData";
import snapchatIcon from '@/assets/img/snapchat2.png';
import defaultIcon from '@/assets/img/snapchat1.png';
// 使用 Vuex store
const store = useStore();

// 定义响应式变量
const pcCurrent = ref("");
const personList = ref([]);
const showChatWindow = ref(false);
const chatWindowInfo = ref({});
const currentIcon = computed(() => {
  return store.state.switchState ? snapchatIcon : defaultIcon; // 根据开关状态返回不同的图标
});


// 切换开关时的逻辑


// 组件挂载时获取朋友列表
onMounted(() => {
  getFriend().then((res) => {
    console.log(res)
    personList.value = res;
  });
});

// 处理点击人员卡片
const clickPerson = (info) => {
  showChatWindow.value = true;
  chatWindowInfo.value = info;
  pcCurrent.value = info.id;
};

// 处理人员卡片排序
const personCardSort = (id) => {
  if (id !== personList.value[0].id) {
    let nowPersonInfo;
    for (let i = 0; i < personList.value.length; i++) {
      if (personList.value[i].id === id) {
        nowPersonInfo = personList.value[i];
        personList.value.splice(i, 1);
        break;
      }
    }
    personList.value.unshift(nowPersonInfo);
  }
};

// 处理图片加载错误
const handleImageError = () => {
  console.error("Failed to load image");
  // 你可以在这里设置一个默认图片或其他逻辑
};
</script>

<style lang="scss" scoped src="./index.scss"/>
