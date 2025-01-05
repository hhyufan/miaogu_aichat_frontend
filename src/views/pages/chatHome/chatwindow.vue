<template>
  <div class="chat-window">
    <div class="top">
      <div class="head-pic">
        <HeadPortrait :imgUrl="friendHeadImg" @error="handleImageError" />
      </div>
      <div class="info-detail">
        <div class="name">{{ friendInfo.name }}</div>
        <div class="detail">{{ friendInfo.detail }}</div>
      </div>
    </div>
    <div class="bottom">
      <div class="chat-content" ref="chatContent">
        <div v-if="loading">加载中...</div>
        <div v-else>
          <div class="chat-wrapper" v-for="item in chatList" :key="item.id">
            <div class="chat-friend" v-if="item.uid !== 'User'">
              <div class="info-time">
                <img :src="friendHeadImg" alt="" @error="() => handleImageError(item)" />
                <span>{{ item.time.slice(0, 19).replace("T", " ") }}</span>
                <span>{{friendName}}</span>
              </div>
              <div class="chat-text">{{ item.msg }}</div>
            </div>
            <div class="chat-me" v-else>
              <div class="info-time">
                <span>{{ item.time.slice(0, 19).replace("T", " ") }}</span>
                <span>{{userName}}</span>
                <img :src="headPortraitImg" alt="" @error="() => handleImageError(item)" />
              </div>
              <div class="chat-text">{{ item.msg }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="chatInputs">
        <input
            class="inputs"
            v-model="inputMsg"
            @keyup.enter="sendText"
        />
        <div class="send" @click="sendText">
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
          <span>Send</span>
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
import store from "@/vuex/store.js"; // 导入头像 GPT4
const userName = computed(() => store.state.UserName);

export default {
  components: {
    HeadPortrait
  },
  props: {
    friendInfo: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const chatList = ref([]);
    const inputMsg = ref("");
    const chatContent = ref(null);
    const loading = ref(false);
    const friendHeadImg = ref(props.friendInfo.headImg || defaultHeadImg); // 初始值为好友头像或默认头像
    const friendName = ref(props.friendInfo.name)
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



    const scrollBottom = debounce(() => {
      const scrollDom = chatContent.value;
      animation(scrollDom, scrollDom.scrollHeight - scrollDom.offsetHeight, () => {
        console.log("滚动到达底部");
      });
    }, 50);

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
            console.error('Failed to fetch chat messages:', error);
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
        const formattedTime = now.toISOString().slice(0, 19).replace("T", " ")  // 格式化为 "yyyy-MM-dd HH:mm:ss"

        let chatMsg = {
          time: formattedTime, // 使用格式化后的时间
          msg: inputMsg.value, // 用户输入的消息
          uid: "User" // 用户 ID
        };

        let AIChatMsg = {
          time: formattedTime, // 使用格式化后的时间
          msg: null, // 用户输入的消息
          uid: "AI" // 用户 ID
        }
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

                AIChatMsg.msg = response.data
                chatList.value.push(AIChatMsg);
                nextTick(() => {
                  scrollBottom(); // 滚动到底部
                });

              } else {
                console.error('发送消息失败:', response.msg);
              }
            })
            .catch(error => {
              console.error('发送消息时出错:', error);
            });
      } else {
        console.warn("消息不能为空哦~");
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
      chatList,
      inputMsg,
      sendText,
      chatContent,
      loading,
      friendHeadImg,
      headPortraitImg,
      handleImageError,
      userName,
      friendName
    };
  }
};
</script>

<style lang="scss" scoped>
.chat-window {
  width: 100%;
  height: 100%;
  margin-left: 20px;
  position: relative;

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

      .name {
        font-size: 20px;
        font-weight: 600;
        color: #9374ef;
      }

      .detail {
        color: #8a6dea;
        font-size: 12px;
        margin-top: 2px;
      }
    }
  }

  .bottom {
    width: 100%;
    height: 70vh;
    background-color: rgb(238, 241, 168);
    border-radius: 20px;
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
            padding: 20px;
            border-radius: 20px 20px 20px 5px;
            background-color: rgba(255, 255, 255, 0.7);
            color: #9374ef;

            &:hover {
              background-color: rgb(39, 42, 55);
            }
          }

          .info-time {
            margin: 10px 0;
            color: #997dec;
            font-size: 14px;

            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              vertical-align: middle;
              margin-right: 10px;
            }

            span:last-child {
              color: rgb(153, 125, 236);
              margin-left: 10px;
              vertical-align: middle;
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
            padding: 20px;
            border-radius: 20px 20px 5px 20px;
            background-color: rgb(153, 125, 236);
            color: #e3ed67;

            &:hover {
              background-color: rgb(111, 81, 209);
            }
          }

          .info-time {
            margin: 10px 0;
            color: #997dec;
            font-size: 14px;
            display: flex;
            justify-content: flex-end;

            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              vertical-align: middle;
              margin-left: 10px;
            }

            span {
              line-height: 30px;
            }

            span:first-child {
              color: rgb(153, 125, 236);
              margin-right: 10px;
              vertical-align: middle;
            }
          }
        }
      }
    }

    .chatInputs {
      width: 90%;
      position: absolute;
      bottom: 0;
      margin: 3%;
      display: flex;

      .boxinput {
        width: 50px;
        height: 50px;
        background-color: rgb(172, 154, 228);
        border-radius: 15px;
        border: 1px solid rgb(153, 125, 236);
        position: relative;
        cursor: pointer;

        img {
          width: 30px;
          height: 30px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .inputs {
        width: 90%;
        height: 50px;
        background-color: rgb(172, 154, 228);
        border-radius: 15px;
        border: 2px solid rgb(153, 125, 236);
        padding: 10px;
        box-sizing: border-box;
        transition: 0.2s;
        font-size: 20px;
        color: #fff;
        font-weight: 100;
        margin: 0 20px;

        &:focus {
          outline: none;
        }
      }


      .send {
        background-color: rgb(153, 125, 236);
        font-family: inherit;
        display: flex;
        align-items: center;
        border: none;
        border-radius: 10px;
        font-weight: bold;
        overflow: hidden;
        font-size: 10px;
        color: #d1dc71;
        box-shadow: 0 0 5px 0 rgb(111, 81, 209);
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

        &:hover {
          box-shadow: 0 0 10px 0 rgb(111, 81, 209);
          .svg-wrapper {
            animation: fly-1 0.6s ease-in-out infinite alternate;
          }

          svg {
            transform: translateX(1.2em) rotate(45deg) scale(1.1);
          }

          span {
            transform: translateX(5em);
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
