<template>
  <div class="chatHome">
    <div class="chatLeft">
      <div :class="[`title-color${switchState ? 'A' : 'B'}`,'title']">
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
      <div class="switch-container">
        <div class="switch">
          <input type="checkbox" id="toggle" v-model="switchState" @change="clickToggle"> <!-- 使用 Vuex 状态 -->
          <label for="toggle" class="slider"></label>
        </div>
      </div>
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
  return switchState.value ? snapchatIcon : defaultIcon; // 根据开关状态返回不同的图标
});
// 计算属性映射 Vuex 状态
const switchState = computed({
  get: () => store.state.switchState,
  set: (value) => store.commit('toggleSwitch', value), // 提交 mutation 更新 Vuex 状态
});

// 切换开关时的逻辑
const clickToggle = () => {
  console.log("Switch is now: ", switchState.value);
};

// 组件挂载时获取朋友列表
onMounted(() => {
  getFriend().then((res) => {
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


<style lang="scss" scoped>
.chatHome {
  display: flex;

  .chatLeft {
    width: 280px;
    .title-colorA {
      color: #8a6dea;
    }
    .title-colorB {
      color: #fab260;
    }
    .title {
      transition: color 0.2s ease;
      margin-top: 20px;
      padding-left: 10px;
    }

    .online-person {
      margin-top: 60px;

      .person-cards-wrapper {
        padding-left: 10px;
        height: 65vh;
        margin-top: 20px;
        overflow: hidden;
        overflow-y: scroll;
        box-sizing: border-box;

        &::-webkit-scrollbar {
          width: 0;
          /* Safari,Chrome 隐藏滚动条 */
          height: 0;
          /* Safari,Chrome 隐藏滚动条 */
          display: none;
          /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
        }
      }
    }
  }
  .chatRight {
    position: relative;
    margin-top: 20px;
    flex: 1;
    padding-right: 30px;

    .switch {
      width: 60px;
      height: 34px;
      position: relative; /* 绝对定位标签 */

    }
    .switch-container {
      position: absolute;
      z-index: 1000;
      top: 15px; /* 上边界居中 */
      right: 30px; /* 相对于容器最右边对齐 */

      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(200deg, #fbed77, #f0c784); /* Initial background color */
        transition:  filter 0.4s ease;
        border-radius: 34px;
        filter: hue-rotate(0deg); /* Initial filter value */
        &:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: transform 0.4s ease;
          border-radius: 50%;
        }
      }
      input:checked + .slider {
        filter: hue-rotate(220deg); /* Change filter value */
      }

      input:checked + .slider:before {
        transform: translateX(26px);
      }
    }


    .showIcon {
      position: relative;
      top: calc(50% - 150px); /* 垂直居中 */
      left: calc(50% - 150px); /* 水平居中 */
      transition: all 0.5s ease-in-out;
      .icon-snapchat {
        pointer-events: none;
        width: 300px;
        height: 300px;
        font-size: 300px;
      }
    }
  }
}
</style>
