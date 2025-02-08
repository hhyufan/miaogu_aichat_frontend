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
        <div v-if="loading" class="loading-content">
          <div class="loading" >
            <div style="--x:0" :class="[`loading-color${switchState ? 'A' : 'B'}`]"></div>
            <div style="--x:1" :class="[`loading-color${switchState ? 'A' : 'B'}`]"></div>
            <div style="--x:2" :class="[`loading-color${switchState ? 'A' : 'B'}`]"></div>
            <div style="--x:3" :class="[`loading-color${switchState ? 'A' : 'B'}`]"></div>
            <div style="--x:4" :class="[`loading-color${switchState ? 'A' : 'B'}`]"></div>
            <div style="--x:5" :class="[`loading-color${switchState ? 'A' : 'B'}`]"></div>
          </div>
          <div :class="[`loading-text${switchState ? 'A' : 'B'}`, 'loading-text']">
            <h3 >加载中......</h3>
          </div>
        </div>
        <div v-else>
          <div class="chat-wrapper" v-for="(item, index) in chatList" :key="index">
            <div class="chat-friend" v-if="item.role !== 'user'">
              <div :class="['info-time', `info-time-color${switchState ? 'A' : 'B'}`]">
                <img :src="friendHeadImg" alt="" @error="() => handleImageError(item)" />
                <span>{{ item.time.slice(0, 19).replace("T", " ") }}</span>&nbsp;
                <span>{{friendName}}</span>

              </div>
              <MarkdownViewer :class="['chat-text', `chat-text${switchState ? 'A' : 'B'}`]" :markdown=" item.content " />
            </div>
            <div class="chat-me" v-else>
              <div :class="['info-time', `info-time-color${switchState ? 'A' : 'B'}`]">
                <span>{{ item.time.slice(0, 19).replace("T", " ") }}</span>&nbsp;
                <span>{{userName}}</span>
                <img :src="headPortraitImg" alt="" @error="() => handleImageError(item)" />
              </div>
              <MarkdownViewer :class="['chat-text', `chat-text${switchState ? 'A' : 'B'}`]" :markdown=" item.content " />
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
        <textarea
            ref="textareaRef"
            :style="{ height: textareaHeight + 'px' }"
            @input="handleAutoResize"
            rows="1"
            :class="[`inputs-color${switchState ? 'A' : 'B'}`,'inputs']"
            v-model="inputMsg"
            @keydown.enter="handleTextareaEnter"
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
import avatarDeepSeek from "@/assets/img/head_portrait3.jpg"; // Import avatar for GPT4
import store from "@/vuex/store.js"; // Import Vuex store
import { toast } from "@/plugins/toast.js"; // Import toast notifications
import MarkdownViewer from "@/views/components/MarkdownViewer.vue"; // Import MarkdownViewer component
const textareaRef = ref(null)
const textareaHeight = ref(40) // 初始高度
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

// Function to get avatar based on role
const getAvatar = (role) => {
  switch (role) {
    case '1002':
      return avatarGPT3_5; // Return GPT3_5 avatar
    case '1003':
      return avatarGPT4; // Return GPT4 avatar
    case '1004':
      return avatarDeepSeek;
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
const scrollBottomNotDebounce = () => {
  const scrollDom = chatContent.value;
  animation(scrollDom, scrollDom.scrollHeight - scrollDom.offsetHeight, () => {
        console.log("Scrolled to bottom");
      }
  );
}
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
      content: inputMsg.value,
      role: "user", // User ID
    };

    const AIChatMsg = {
      time: formattedTime,
      content: "",
      role: "assistant", // AI ID
    };
    chatMsg.content = chatMsg.content.replaceAll("\n", "<br>")
    chatList.value.push(chatMsg);
    inputMsg.value = '' // Clear input
    handleAutoResize()
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
                AIChatMsg.content += responseData.charAt(index);
                currentTyping.value = AIChatMsg.content;
                index++;
                scrollBottomNotDebounce();
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
            toast.error("发送消息失败！", { error: response.msg });
          }
        })
        .catch(error => {
          toast.error("Error sending message", { error });
        });
  } else {
    await toast.warning("消息不能为空~", { closable: true, duration: 2000, debounce: 2500 });
  }
};
const handleAutoResize = () => {
  nextTick(() => {
    const textarea = textareaRef.value
    if (!textarea) return

    // 重置高度后获取滚动高度
    textarea.style.height = 'auto'
    const newHeight = Math.min(textarea.scrollHeight, 200) // 设置最大高度 200px

    // 更新高度值
    textareaHeight.value = newHeight > 40 ? newHeight : 40 // 最小高度 40px
  })
}
// Lifecycle hook to fetch messages on mount
onMounted(() => {
  handleAutoResize()
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

// 新增处理文本域回车事件
const handleTextareaEnter = (event) => {
  if (!event.shiftKey) {
    event.preventDefault(); // 阻止默认回车换行行为
    sendText();
  }
};
</script>

<style lang="scss" scoped src="./chatwindow.scss"/>
