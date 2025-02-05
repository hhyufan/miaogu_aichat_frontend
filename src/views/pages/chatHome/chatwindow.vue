<template>
  <div class="chat-window">
    <div class="switch-container">
      <div class="switch">
        <input type="checkbox" id="toggle" v-model="switchState"> <!-- 使用 Vuex 状态 -->
        <label for="toggle" class="slider"></label>
      </div>
    </div>
    <div class="top">
      <div class="head-pic">
        <HeadPortrait :imgUrl="friendHeadImg" @error="handleImageError" />
      </div>
      <div class="info-detail">
        <div :class="[`name-color${switchState ? 'A' : 'B'}`,'name']">{{ friendInfo.name }}</div>
        <div :class="[`detail-color${switchState ? 'A' : 'B'}`,'detail']">{{ friendInfo.detail }}</div>
      </div>
    </div>
    <div :class="[`bottom-color${switchState ? 'A' : 'B'}`, 'bottom']">
      <div class="chat-content" ref="chatContent">
        <div v-if="loading">加载中...</div>
        <div v-else>
          <div class="chat-wrapper" v-for="(item, index) in chatList" :key="index">
            <div class="chat-friend" v-if="item.uid !== 'User'">
              <div :class="['info-time', `info-time-color${switchState ? 'A' : 'B'}`]">
                <img :src="friendHeadImg" alt="" @error="() => handleImageError(item)" />
                <span>{{ item.time.slice(0, 19).replace("T", " ") }}</span>&nbsp;
                <span>{{friendName}}</span>

              </div>
              <MarkdownViewer :class="['chat-text', `chat-text${switchState ? 'A' : 'B'}`]" :markdown=" item.msg " />
            </div>
            <div class="chat-me" v-else>
              <div :class="['info-time', `info-time-color${switchState ? 'A' : 'B'}`]">
                <span>{{ item.time.slice(0, 19).replace("T", " ") }}</span>&nbsp;
                <span>{{userName}}</span>
                <img :src="headPortraitImg" alt="" @error="() => handleImageError(item)" />
              </div>
              <MarkdownViewer :class="['chat-text', `chat-text${switchState ? 'A' : 'B'}`]" :markdown=" item.msg " />
            </div>
          </div>
          <div class="chat-wrapper" v-if="isAITyping">
            <div class="chat-friend">
              <div :class="['info-time', `info-time-color${switchState ? 'A' : 'B'}`]">
                <img :src="friendHeadImg" alt=""/>
                <span>{{friendName}}</span>
              </div>
              <div>
                <MarkdownViewer :class="['chat-text', `chat-text${switchState ? 'A' : 'B'}`]" :markdown=" currentTyping " />
              </div>
            </div>
          </div>
          <div class="chat-wrapper" v-if="isBeforeTyping">
            <div class="chat-friend">
              <div :class="['info-time', `info-time-color${switchState ? 'A' : 'B'}`]">
                <img :src="friendHeadImg" alt=""/>
                <span>{{friendName}}</span>
              </div>
              <div :class="['chat-text', `chat-text${switchState ? 'A' : 'B'}`]"  >
                <div class= 'loader' >
                  <span class="load" :class="[`load${switchState ? 'A' : 'B'}`]"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chatInputs">
        <input
            :class="[`inputs-color${switchState ? 'A' : 'B'}`,'inputs']"
            v-model="inputMsg"
            @keyup.enter="sendText"
        />
        <div :class="[`hover-${switchState ? 'a' : 'b'}`, `send-color${switchState ? 'A' : 'B'}`, 'send']" @click="sendText">
          <div class="svg-wrapper-1">
            <div class="svg-wrapper">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                    fill="currentColor"
                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { animation, debounce } from "@/util/util"; // Import debounce function
import { getChatMsg, sendChatMessage } from "@/api/getData";
import HeadPortrait from "@/views/components/HeadPortrait.vue";
import headPortraitImg from "@/assets/img/head_portrait.jpg"; // Import default head image
import defaultHeadImg from '@/assets/icons/user-icon.svg'; // Import default avatar
import avatarGPT3_5 from "@/assets/img/head_portrait1.jpg"; // Import avatar for GPT3_5
import avatarGPT4 from "@/assets/img/head_portrait2.jpg"; // Import avatar for GPT4
import store from "@/vuex/store.js"; // Import Vuex store
import { toast } from "@/plugins/toast.js"; // Import toast notifications
import MarkdownViewer from "@/views/components/MarkdownViewer.vue"; // Import MarkdownViewer component

// Define props
const props = defineProps({
  friendInfo: {
    type: Object,
    required: true,
  },
});

// Computed property for username
const userName = computed(() => store.state.UserName);

// Reactive references
const isBeforeTyping = ref(false);
const isAITyping = ref(false);
const chatList = ref([]);
const inputMsg = ref("");
const chatContent = ref(null);
const loading = ref(false);
const friendHeadImg = ref(props.friendInfo.headImg || defaultHeadImg); // Initial value for friend's avatar
const friendName = ref(props.friendInfo.name);
const currentTyping = ref("");

// Function to get avatar based on uid
const getAvatar = (uid) => {
  switch (uid) {
    case '1002':
      return avatarGPT3_5; // Return GPT3_5 avatar
    case '1003':
      return avatarGPT4; // Return GPT4 avatar
    default:
      return headPortraitImg || defaultHeadImg; // Default avatar
  }
};

// Computed property for switch state
const switchState = computed({
  get: () => store.state.switchState,
  set: (value) => store.commit('toggleSwitch', value), // Commit mutation to update Vuex state
});

// Function to scroll to the bottom of chat
const scrollBottom = debounce(() => {
  const scrollDom = chatContent.value;
  animation(scrollDom, scrollDom.scrollHeight - scrollDom.offsetHeight, () => {
    console.log("Scrolled to bottom");
  });
}, 50);

// Function to fetch friend's chat messages
const getFriendChatMsg = () => {
  loading.value = true;
  const params = {
    friendId: props.friendInfo.id,
  };
  if (!props.friendInfo.id) return;

  getChatMsg(params, props.friendInfo.id)
      .then((res) => {
        chatList.value = res.data;
        nextTick(() => {
          scrollBottom();
        });
      })
      .catch((error) => {
        chatList.value = "";
        console.error('Failed to fetch chat messages:', { error });
      })
      .finally(() => {
        loading.value = false;
      });
};

// Function to send text message
const sendText = async () => {
  if (inputMsg.value) {
    const now = new Date();
    now.setHours(now.getHours() + 8);
    const formattedTime = now.toISOString().slice(0, 19).replace("T", " "); // Format time

    const chatMsg = {
      time: formattedTime,
      msg: inputMsg.value,
      uid: "User", // User ID
    };

    const AIChatMsg = {
      time: formattedTime,
      msg: "",
      uid: "AI", // AI ID
    };

    chatList.value.push(chatMsg);
    inputMsg.value = ""; // Clear input
    await nextTick(() => {
      scrollBottom();
    });
    isBeforeTyping.value = true;

    // Call sendChatMessage API
    await sendChatMessage(chatMsg, props.friendInfo.id)
        .then(response => {
          if (response.code === 200) {
            isAITyping.value = true;
            const responseData = response.data;
            isBeforeTyping.value = false;
            let index = 0;

            const typeMessage = () => {
              nextTick(() => {
                scrollBottom();
              });
              if (index < responseData.length) {
                AIChatMsg.msg += responseData.charAt(index);
                currentTyping.value = AIChatMsg.msg;
                index++;
                scrollBottom();
                setTimeout(typeMessage, 50); // Type character by character
              } else {
                isAITyping.value = false;
                chatList.value.push(AIChatMsg);
                nextTick(() => {
                  scrollBottom();
                });
              }
            };

            typeMessage();
          } else {
            toast.error("Failed to send message", { error: response.msg });
          }
        })
        .catch(error => {
          toast.error("Error sending message", { error });
        });
  } else {
    await toast.warning("Message cannot be empty~", { closable: true, duration: 2000, debounce: 2500 });
  }
};

// Lifecycle hook to fetch messages on mount
onMounted(() => {
  getFriendChatMsg();
});

// Watch for changes in friendInfo
watch(() => props.friendInfo, () => {
  friendName.value = props.friendInfo.name;
  friendHeadImg.value = getAvatar(props.friendInfo.id) || defaultHeadImg; // Update avatar
  getFriendChatMsg();
});

// Handle image loading error
const handleImageError = (item) => {
  console.error("Failed to load image for:", item);
  item.headImg = defaultHeadImg; // Set to default avatar
};

</script>

<style lang="scss" scoped src="./chatwindow.scss"/>
