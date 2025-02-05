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

<style lang="scss" scoped>
.chat-window {
  width: 100%;
  height: 100%;
  margin-left: 20px;
  max-width: 96%;
  position: relative;
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
  .top {
    margin-bottom: 50px;

    &::after {
      content: "";
      display: block;
      clear: both;
    }

    .head-pic {
      float: left;
    }

    .info-detail {
      float: left;
      margin: 5px 20px 0;
      .name-colorA {
        color: #9374ef;
      }
      .name-colorB {
        color: #fab260;
      }
      .name {
        font-size: 20px;
        font-weight: 600;
      }
      .detail-colorA {
        color: #8a6dea;
      }
      .detail-colorB {
        color: #fdc674;
      }
      .detail {
        font-size: 12px;
        margin-top: 2px;
      }
    }
  }
  .bottom-colorA {
    background-color: #c7baf1;
  }

  .bottom-colorB {
    background-color: rgb(238, 244, 175);
  }
  .bottom {
    width: 100%;
    height: 70vh;
    border-radius: 2vmin;
    padding: 20px;
    box-sizing: border-box;
    position: relative;

    .chat-content {
      width: 100%;
      height: 85%;
      overflow-y: scroll;
      padding: 20px;
      box-sizing: border-box;

      &::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
      }

      .chat-wrapper {
        position: relative;
        word-break: break-all;

        .info-time-colorA {
          color: #997dec;
        }
        .info-time-colorB {
          color: #fdc674;
        }

        .chat-textA {
          color: #9374ef;
        }

        .chat-textB {
          color: #fab260;
        }
        .chat-friend {
          width: 100%;
          float: left;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;

          .chat-text {
            max-width: 90%;
            border-radius: 5px 20px 20px 20px;
            background-color: rgba(255, 255, 255, 0.7);
            position: relative;
            min-height: 50px;
            min-width: 90px;
            .loader {
              position: absolute;
              width: 90%;
              height: 100%;
              left: 5%;
              top: 35%;
              .loadA {
                background-color: #9A79FF;
              }
              .loadB {
                background-color: #fbd26c;
              }

              .load {

                border-radius: 50px;
                height: 16px;
                width: 16px;
                position: absolute;
                animation: loading_713 3.5s ease both infinite;
                &.loadA::before {
                  background-color: #D1C2FF; // switchState为true时的颜色
                }
                &.loadB::before {
                  background-color: #f6eba4; // switchState为false时的颜色（示例颜色，按需调整）
                }
                &::before {
                  content: "";
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  background-color: #D1C2FF;
                  border-radius: inherit;
                  animation: loading2_713 3.5s ease both infinite;
                }
              }
            }

            // 修改动画关键帧
            @keyframes loading_713 {
              0% {
                width: 16px;
                left: 50%;  // 保持居中定位
                transform: translateX(-50%);
              }
              40% {
                width: 100%;
                left: 50%;
                transform: translateX(-50%);
              }
              80% {
                width: 16px;
                left: 100%;  // 移动到右侧边界
                transform: translateX(calc(-100% - 16px)); // 保持圆形完整显示
              }
              90% {
                width: 100%;
                left: 0;
                transform: translateX(0);
              }
              100% {
                width: 16px;
                left: 50%;
                transform: translateX(-50%);
              }
            }

            @keyframes loading2_713 {
              0% {
                transform: translateX(0);
                width: 16px;
              }
              40% {
                transform: translateX(0);
                width: 80%;
              }
              80% {
                width: 100%;
                transform: translateX(0);
              }
              90% {
                width: 80%;
                transform: translateX(15px);
              }
              100% {
                transform: translateX(0);
                width: 16px;
              }
            }
          }


          .info-time {
            margin: 10px 0;
            font-size: 14px;

            img {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              vertical-align: middle;
              margin-right: 10px;
            }

          }
        }

        .chat-me {
          width: 100%;
          float: right;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-end;

          .chat-text {
            max-width: 90%;
            border-radius: 20px 5px 20px 20px;
            background-color: rgba(255, 255, 255, 0.7);
          }

          .info-time {
            margin: 10px 0;
            font-size: 14px;
            display: flex;
            justify-content: flex-end;

            img {
              width: 38px;
              height: 38px;
              border-radius: 50%;
              vertical-align: middle;
              margin-left: 10px;
            }

            span {
              line-height: 30px;
            }

          }
        }
      }
    }

    .chatInputs {
      width: 95%;
      position: absolute;
      bottom: 0;
      margin: 2%;
      display: flex;

      .boxinput {
        width: 50px;
        height: 50px;

        border-radius: 15px;

        position: relative;
        cursor: pointer;

        img {
          width: 38px;
          height: 38px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .inputs-colorA {
        background-color: #a78ff3;
        border: 1px solid rgb(153, 125, 236);
      }

      .inputs-colorB {
        background-color: rgb(241, 201, 124);
        border: 2px solid #fdbd5e;
      }


      .inputs {
        width: 90%;
        height: 5vh;
        border-radius: 1vmin;
        padding: 2vh;
        box-sizing: border-box;
        transition: 0.2s;
        font-size: 20px;
        color: rgba(255, 255, 255, 0.74);
        font-weight: 100;
        margin: 0 2vh;

        &:focus {
          outline: none;
        }
      }
      .send-colorA {
        background-color: rgb(186, 165, 244);
        color: #7957ea;
        box-shadow: 0 0 5px 0 rgb(149, 121, 237);
      }
      .send-colorB {
        background-color: #efd3a4;
        color: #f1a720;
        box-shadow: 0 0 5px 0 rgb(220, 227, 155);
      }
      .send {
        width: 2.9vw;
        height: 5vh;
        font-family: inherit;
        display: flex;
        align-items: center;
        border: none;
        border-radius: 10px;
        font-weight: bold;
        overflow: hidden;
        font-size: 10px;
        justify-content: center; /* 水平居中 */
        transition: 0.3s;
        cursor: pointer;

        span {
          display: block;
          margin-left: 0.3em;
          transition: 0.3s;
        }

        svg {
          display: block;
          transform-origin: center center;
          transition: transform 0.3s ease-in-out;
        }

        &.hover-a:hover {
          box-shadow: 0 0 10px 0 rgb(149, 121, 237);
        }

        &.hover-b:hover {
          box-shadow: 0 0 10px 0 rgb(251, 218, 108);
        }

        &:hover {
          .svg-wrapper {
            animation: fly-1 0.6s ease-in-out infinite alternate;
          }

          svg {
            transform: rotate(45deg) scale(1.1);
          }
        }

        &:active {
          transform: scale(0.95);
        }
      }
      @keyframes fly-1 {
        from {
          transform: translateY(0.1em);
        }

        to {
          transform: translateY(-0.1em);
        }
      }
    }
  }
}
</style>
