<template>
  <div class="chat-window">
    <div class="switch-container">
      <div class="switch">
        <input type="checkbox" id="toggle" v-model="switchState" @change="clickToggle"> <!-- 使用 Vuex 状态 -->
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

<script>
import {ref, onMounted, watch, nextTick, computed} from 'vue';
import { animation, debounce } from "@/util/util"; // 引入防抖函数
import {getChatMsg, sendChatMessage} from "@/api/getData";
import HeadPortrait from "@/views/components/HeadPortrait.vue";
import headPortraitImg from "@/assets/img/head_portrait.jpg"; // 使用 import 导入图片
import defaultHeadImg from '@/assets/icons/user-icon.svg'; // 导入默认头像
import avatarGPT3_5 from "@/assets/img/head_portrait1.jpg"; // 导入头像 GPT3_5
import avatarGPT4 from "@/assets/img/head_portrait2.jpg";
import store from "@/vuex/store.js";
import {toast} from "@/plugins/toast.js";
import MarkdownViewer from "@/views/components/MarkdownViewer.vue";
const userName = computed(() => store.state.UserName);

export default {
  components: {
    MarkdownViewer,
    HeadPortrait
  },
  props: {
    friendInfo: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const isAITyping = ref(false);
    const chatList = ref([]);
    const inputMsg = ref("");
    const chatContent = ref(null);
    const loading = ref(false);
    const friendHeadImg = ref(props.friendInfo.headImg || defaultHeadImg); // 初始值为好友头像或默认头像
    const friendName = ref(props.friendInfo.name)
    const currentTyping = ref("")
    const clickToggle = () => {
      console.log("Switch is now: ", switchState.value);
    };
    const getAvatar = (uid) => {
      switch (uid) {
        case '1002':
          return avatarGPT3_5; // 返回 GPT3_5 的头像
        case '1003':
          return avatarGPT4; // 返回 GPT4 的头像
        default:
          return headPortraitImg || defaultHeadImg; // 默认头像
      }
    };
// 计算属性映射 Vuex 状态
    const switchState = computed({
      get: () => store.state.switchState,
      set: (value) => store.commit('toggleSwitch', value), // 提交 mutation 更新 Vuex 状态
    });
    const scrollBottom = debounce(() => {
      const scrollDom = chatContent.value;
      animation(scrollDom, scrollDom.scrollHeight - scrollDom.offsetHeight, () => {
        console.log("滚动到达底部");
      });
    }, 50);
    const scrollBottomWithoutDebounce = () => {
      const scrollDom = chatContent.value;
      animation(scrollDom, scrollDom.scrollHeight - scrollDom.offsetHeight, () => {
        console.log("滚动到达底部");
      });
    }
    const getFriendChatMsg = () => {
      loading.value = true;
      let params = {
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
            chatList.value = ""
            console.error('Failed to fetch chat messages:', {error});
          })
          .finally(() => {
            loading.value = false;
          });
    };
    const sendText = () => {
      if (inputMsg.value) {
        // 获取当前时间并格式化
        let now = new Date(); // 获取当前时间
        now.setHours(now.getHours() + 8);
        const formattedTime = now.toISOString().slice(0, 19).replace("T", " ");  // 格式化为 "yyyy-MM-dd HH:mm:ss"
        let chatMsg = {
          time: formattedTime, // 使用格式化后的时间
          msg: inputMsg.value, // 用户输入的消息
          uid: "User" // 用户 ID
        };

        let AIChatMsg = {
          time: formattedTime, // 使用格式化后的时间
          msg: "", // 初始为空，后续逐字填充
          uid: "AI" // 用户 ID
        };

        chatList.value.push(chatMsg); // 更新聊天列表
        inputMsg.value = ""; // 清空输入框
        nextTick(() => {
          scrollBottom(); // 滚动到底部
        });

        // 调用 sendChatMessage API
        sendChatMessage(chatMsg, props.friendInfo.id)
            .then(response => {
              if (response.code === 200) {
                // 如果发送成功，将消息添加到聊天记录
                isAITyping.value = true;
                const responseData = response.data;
                let index = 0;

                const typeMessage = () => {
                  nextTick(() => {
                    scrollBottom(); // 滚动到底部
                  });
                  if (index < responseData.length) {
                    AIChatMsg.msg += responseData.charAt(index);
                    currentTyping.value = AIChatMsg.msg;
                    index++;
                    scrollBottomWithoutDebounce()
                    setTimeout(typeMessage, 50); // 每50毫秒输出一个字符
                  } else {
                    isAITyping.value = false;
                    chatList.value.push(AIChatMsg);
                    nextTick(() => {
                      scrollBottom(); // 滚动到底部
                    });
                  }
                };

                typeMessage(); // 开始逐字打印
              } else {
                toast.error("发送消息失败", { error: response.msg });
              }
            })
            .catch(error => {
              toast.error("发送消息时出错", { error });
            });
      } else {
        toast.warning("消息不能为空哦~", { closable: true, duration: 2000, debounce: 2500 });
      }
    };

    onMounted(() => {
      getFriendChatMsg();
    });

    watch(() => props.friendInfo, () => {
      friendName.value = props.friendInfo.name
      friendHeadImg.value = getAvatar(props.friendInfo.id) || defaultHeadImg; // 更新头像
      getFriendChatMsg();
    });

    const handleImageError = (item) => {
      console.error("Failed to load image for:", item);
      item.headImg = defaultHeadImg; // 设置为默认头像
    };

    return {
      isAITyping,
      currentTyping,
      clickToggle,
      chatList,
      inputMsg,
      sendText,
      chatContent,
      loading,
      friendHeadImg,
      headPortraitImg,
      handleImageError,
      userName,
      friendName,
      switchState
    };
  }
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
            border-radius: 20px 20px 20px 5px;
            background-color: rgba(255, 255, 255, 0.7);

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
            border-radius: 20px 20px 5px 20px;
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
