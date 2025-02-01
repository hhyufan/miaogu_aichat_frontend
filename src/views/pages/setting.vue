<template>
  <div class="profile-container">
    <!-- 个人信息展示 -->
    <div class="profile-card">
      <h2>用户信息</h2>
      <div class="profile-info">
        <p><strong>用户名：</strong>{{ userInfo.username }}</p>
        <p><strong>电子邮箱：</strong>{{ userInfo.email }}</p>
        <p><strong>注册时间：</strong>{{ formatDate(userInfo.registrationDate) }}</p>
        <p><strong>最后登录：</strong>{{ formatDate(userInfo.lastLogin) }}</p>
      </div>
    </div>

    <!-- 操作按钮组 -->
    <div class="button-group">
      <!-- 回滚按钮 -->
      <div class="button-container">
        <button class="rollback-button" @click="rollbackChat">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              class="rollback-icon"
              viewBox="0 0 16 16"
          >
            <path
                d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
            ></path>
            <path
                fill-rule="evenodd"
                d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
            ></path>
          </svg>
          <span class="tooltip">还原聊天记录</span>
        </button>
      </div>

      <!-- 清空按钮 -->
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

      <!-- GitHub按钮 -->
      <div class="button-container">
        <button class="github-button" @click="openGithub">
          <svg class="github-icon" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
          </svg>
          <span class="tooltip">查看GitHub仓库</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import {clearChatMsg, rollbackChatMsg} from "@/api/getData.js";
import {toast} from "@/plugins/toast.js";

export default defineComponent({
  data() {
    return {
      userInfo: {
        username: "看我干嘛",
        email: "114514@cute.qwq",
        registrationDate: "2023-01-01T00:00:00",
        lastLogin: "2023-10-15T08:30:00"
      }
    };
  },
  methods: {
    formatDate(isoString) {
      return new Date(isoString).toLocaleString();
    },
    async rollbackChat() {
      const confirmed = confirm("确定要回滚到上次保存的聊天记录吗？此操作不可逆。");
      if (!confirmed) {
        await toast.warning("操作已取消", {closable: true});
        return;
      }

      try {
        const response = await rollbackChatMsg();
        if (response.code === 200) {
          await toast.success("成功恢复聊天记录！", {closable: true});
        } else {
          await toast.error("回滚操作失败");
        }
      } catch (error) {
        await toast.error("回滚过程中发生错误");
        console.error("Rollback error:", error);
      }
    },
    clearChat() {
      const confirmed = confirm("您确定要删除所有聊天记录吗？此操作不可逆。");
      if (confirmed) {
        clearChatMsg()
            .then(response => {
              if (response.code === 204) {
                toast.success("聊天记录已清空", {closable: true});
              } else {
                toast.error("清空聊天记录失败！");
              }
            })
            .catch(error => {
              toast.error("清空聊天记录时发生错误！", error);
            });
      } else {
        toast.warning("操作已取消", {closable: true});
      }
    },
    openGithub() {
      window.open('https://github.com/hhyufan/miaogu_aichat_frontend', '_blank')
    }
  }
});
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
}

.profile-card {
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.profile-card h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.profile-info p {
  margin: 1rem 0;
  padding: 0.8rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.95rem;
}

.profile-info strong {
  color: #34495e;
  min-width: 80px;
  display: inline-block;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.button-container {
  position: relative;
  display: flex;
  justify-content: center;
}

/* 清空按钮样式 */
.bin-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  border-radius: 15px;
  background-color: rgb(255, 95, 95);
  cursor: pointer;
  border: 3px solid rgb(255, 201, 201);
  transition: all 0.3s ease;
  overflow: hidden;
}

.bin-bottom {
  width: 15px;
}

.bin-top {
  width: 17px;
  transform-origin: right;
  transition: transform 0.3s ease;
}

/* 回滚按钮样式 */
.rollback-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  border-radius: 15px;
  background-color: #4D96FF;
  cursor: pointer;
  border: 3px solid #B6D1FF;
  transition: all 0.3s ease;
}

/* GitHub按钮样式 */
.github-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  border-radius: 15px;
  background-color: #24292E;
  cursor: pointer;
  border: 3px solid #444D56;
  transition: all 0.3s ease;
}

.rollback-icon,
.github-icon {
  width: 28px;
  height: 28px;
  transform-origin: center;
  transition: transform 0.3s ease;
}

/* 悬停动画效果 */
.rollback-button:hover .rollback-icon {
  animation: spin 1.2s linear infinite;
}

.github-button:hover .github-icon {
  animation: bounce 0.8s ease infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* 通用悬停效果 */
.bin-button:hover,
.rollback-button:hover,
.github-button:hover {
  width: 170px;
}

.bin-button:hover {
  background-color: rgb(255, 0, 0);
}

.rollback-button:hover {
  background-color: #2E7BFF;
}

.github-button:hover {
  background-color: #1B1F23;
}

.bin-button:hover .bin-top {
  transform: rotate(45deg);
}

/* 点击动画 */
.bin-button:active,
.rollback-button:active,
.github-button:active {
  transform: scale(0.9);
}

/* 工具提示 */
.tooltip {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  white-space: nowrap;
}

.button-container:hover .tooltip {
  opacity: 1;
}

/* 移动端适配 */
@media (max-width: 600px) {
  .profile-container {
    padding: 10px;
  }

  .profile-card {
    padding: 1rem;
  }

  .button-group {
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .bin-button:hover,
  .rollback-button:hover,
  .github-button:hover {
    width: 55px;
  }
}
</style>
