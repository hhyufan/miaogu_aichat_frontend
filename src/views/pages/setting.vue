<template>
  <div class="button-container">
    <button class="bin-button" @click="clearChat">
      <svg class="bin-top" viewBox="0 0 39 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line y1="5" x2="39" y2="5" stroke="white" stroke-width="4"></line>
        <line x1="12" y1="1.5" x2="26.0357" y2="1.5" stroke="white" stroke-width="3"></line>
      </svg>
      <svg class="bin-bottom" viewBox="0 0 33 39" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="path-1-inside-1_8_19" fill="white">
          <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
        </mask>
        <path d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z" fill="white" mask="url(#path-1-inside-1_8_19)"></path>
        <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
        <path d="M21 6V29" stroke="white" stroke-width="4"></path>
      </svg>
      <span class="tooltip">清空聊天记录</span>
    </button>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import {clearChatMsg} from "@/api/getData.js";

export default defineComponent({
  methods: {
    clearChat() {
      // 弹出确认框
      const confirmed = confirm("您确定要删除所有聊天记录吗？此操作不可逆。");
      if (confirmed) {
        clearChatMsg().then(response => {
          if (response.code === 204) {
            alert(response.msg);
          } else {
            alert("清空聊天记录失败！");
          }
        }).catch(error => {
          console.error('清空聊天记录时出错:', error);
          alert("清空聊天记录时发生错误！");
        });
        console.log("聊天记录已清空");
      } else {
        console.log("用户取消了清空聊天记录的操作");
      }
    }
  }
});
</script>

<style>
.button-container {
  display: flex;
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
  height: 100vh; /* 使容器占满整个视口高度 */
}

.bin-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative; /* 使伪元素相对于按钮定位 */
  width: 55px; /* 初始宽度 */
  height: 55px;
  border-radius: 15px;
  background-color: rgb(255, 95, 95);
  cursor: pointer;
  border: 3px solid rgb(255, 201, 201);
  transition: width 0.3s ease, background-color 0.3s ease; /* 添加宽度过渡 */
  overflow: hidden; /* 防止文本超出按钮 */
}

.bin-bottom {
  width: 15px;
}

.bin-top {
  width: 17px;
  transform-origin: right;
  transition-duration: 0.3s;
}

.tooltip {
  position: absolute;
  bottom: 60px; /* 冒泡框距离按钮的距离 */
  left: 50%; /* 冒泡框水平居中 */
  transform: translateX(-50%); /* 冒泡框水平居中 */
  background-color: rgba(0, 0, 0, 0.7); /* 冒泡框背景颜色 */
  color: white; /* 冒泡框文字颜色 */
  padding: 5px 10px; /* 冒泡框内边距 */
  border-radius: 5px; /* 冒泡框圆角 */
  opacity: 0; /* 初始透明 */
  transition: opacity 0.3s ease; /* 平滑过渡 */
  pointer-events: none; /* 禁用冒泡框的事件 */
}

.bin-button:hover .tooltip {
  opacity: 1; /* 鼠标悬停时显示冒泡框 */
}

.bin-button:hover .bin-top {
  transform: rotate(45deg);
}

.bin-button:hover {
  width: 150px; /* 鼠标悬停时扩展按钮宽度 */
  background-color: rgb(255, 0, 0);
}

.bin-button:active {
  transform: scale(0.9);
}
</style>
