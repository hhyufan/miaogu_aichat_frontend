<template>
  <div class="chatHome">
    <div class="chatLeft">
      <div class="title">
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
        <img class="icon-snapchat" :src="snapchatIcon" alt="" @error="handleImageError" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import PersonCard from "@/views/components/PersonalCard.vue";
import ChatWindow from "./chatwindow.vue";
import { getFriend } from "@/api/getData";
import snapchatIcon from '@/assets/img/snapchat.png';

export default defineComponent({
  name: "App",
  components: {
    PersonCard,
    ChatWindow,
  },
  setup() {
    const pcCurrent = ref("");
    const personList = ref([]);
    const showChatWindow = ref(false);
    const chatWindowInfo = ref({});

    onMounted(() => {
      getFriend().then((res) => {
        personList.value = res;
      });
    });

    const clickPerson = (info) => {
      showChatWindow.value = true;
      chatWindowInfo.value = info;
      pcCurrent.value = info.id;
    };

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

    const handleImageError = () => {
      console.error("Failed to load image");
      // 你可以在这里设置一个默认图片或其他逻辑
    };

    return {
      pcCurrent,
      personList,
      showChatWindow,
      chatWindowInfo,
      clickPerson,
      personCardSort,
      snapchatIcon,
      handleImageError
    };
  }
});
</script>

<style lang="scss" scoped>
.chatHome {
  display: flex;

  .chatLeft {
    width: 280px;

    .title {
      margin-top: 20px;
      color: #997dec;
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
    margin-top: 20px;
    flex: 1;
    padding-right: 30px;

    .showIcon {
      position: absolute;
      top: calc(50% - 150px); /* 垂直居中 */
      left: calc(50% - 50px); /* 水平居中 */

      .icon-snapchat {
        width: 300px;
        height: 300px;
        font-size: 300px;
      }
    }
  }
}
</style>
