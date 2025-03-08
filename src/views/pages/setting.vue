<template>
  <div class="profile-container">
    <div class="profile-card">
      <!-- 用户信息部分 -->
      <div class="profile-header">
        <h2>用户信息</h2>
        <div class="profile-meta">
          <span class="user-status"></span>
          <span class="active-label">在线</span>
        </div>
      </div>

      <div class="profile-info">
        <p><strong>昵称：</strong>{{ userInfo.username }}</p>
        <p><strong>邮箱：</strong>{{ userInfo.email }}</p>
        <!--        <p><strong>注册时间：</strong>{{ formatDate(userInfo.registrationDate) }}</p>-->
        <p><strong>最后登录：</strong>{{ userInfo.lastLogin }}</p>
      </div>

      <!-- 操作按钮组 -->
      <div class="button-group">
        <!-- GitHub按钮 -->
        <div class="button-container github-container">
          <button class="custom-button" @click="openGithub">
            <span class="button-highlight"></span>
            <div class="button-content">
              <SvgLoader name="github" />
              <span class="button-text">Star on GitHub</span>
            </div>
            <div class="star-count">
              <SvgLoader name="star" />
              <span class="count-text">{{ store.state.repoStarCount }}</span>
            </div>
            <span class="tooltip">Star on GitHub</span>
          </button>
        </div>
        <!-- GitHub按钮 -->
        <div class="button-divider"></div>

        <!-- 回滚按钮和清空按钮 -->
        <div class="right-buttons">
          <div class="button-container">
            <button class="bin-button" @click="clearChat">
              <SvgLoader name="trash-can-lid" />
              <SvgLoader name="trash-can" />
              <span class="tooltip">清空聊天记录</span>
            </button>
          </div>

          <div class="button-container">
            <button class="rollback-button" @click="rollbackChat">
              <SvgLoader name="refresh" />
              <span class="tooltip">还原聊天记录</span>
            </button>
          </div>

          <div class="button-container">
            <button class="logout-button" @click="exit">
              <SvgLoader name="exit" />
              <span class="tooltip">退出登录</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted } from 'vue';
import { clearChatMsg, rollbackChatMsg, getRepoStarCount, logout } from "@/api/getData.js";
import { toast } from "@/plugins/toast.js";
import store from "@/vuex/store.js";
import env from '@/util/env.js';
import SvgLoader from '../components/SvgLoader.vue';

// Reactive reference for userInfo from the store
const userInfo = computed(() => store.state.userInfo);

// Lifecycle hook to fetch repo star count when the component is created
onMounted(() => {
  getRepoStarCount("hhyufan", "miaogu_aichat_frontend");
});

// Method to rollback chat messages
const rollbackChat = async () => {
  const confirmed = confirm("确定要回滚到上次保存的聊天记录吗？此操作不可逆。");
  if (!confirmed) {
    await toast.warning("操作已取消", { closable: true });
    return;
  }

  try {
    const response = await rollbackChatMsg();
    console.log("???" + JSON.stringify(response));
    if (response.code === 200) {
      await toast.success("成功恢复聊天记录！", { closable: true });
    } else if (response.code === 404) {
      await toast.warning("无历史版本！", { closable: true });
    } else {
      await toast.error("回滚消息失败！");
    }
  } catch (error) {
    await toast.error("回滚过程中发生错误");
    console.error("Rollback error:", error);
  }
};

// Method to clear chat messages
const clearChat = () => {
  const confirmed = confirm("您确定要删除所有聊天记录吗？此操作不可逆。");
  if (confirmed) {
    clearChatMsg()
      .then(response => {
        if (response.code === 204) {
          toast.success("聊天记录已清空", { closable: true });
        } else {
          toast.error("清空聊天记录失败！");
        }
      })
      .catch(error => {
        toast.error("清空聊天记录时发生错误！", error);
      });
  } else {
    toast.warning("操作已取消", { closable: true });
  }
};

// Method to open GitHub repository
const openGithub = () => {
  window.open(env.GITHUB_REPOSITORY_URL, '_blank');
};

// Method for logging out
const exit = () => {
  const confirmed = confirm("您确定要退出当前账号？");
  if (confirmed) {
    logout()
      .then(response => {
        if (response.code === 200) {
          toast.success("退出账号成功");
          setTimeout(() => {
            // 重置 store 状态
            store.commit('resetState');
            // 清除 localStorage 中的持久化数据
            localStorage.removeItem('my-app-storage'); // 与 vuex-persistedstate 的 key 一致
            window.location.href = env.APP_URL;

          }, 1500);
        }
      })
      .catch(error => {
        toast.error("退出账号时发生错误！", error);
      });
  } else {
    toast.warning("操作已取消", { closable: true });
  }
};
</script>

<style scoped>
/* 保持原有动画和按钮样式 */
.profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 20px;
}

.github-container {
  width: 40%;
}

.profile-card {
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.profile-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.profile-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-button {
  display: flex;
  overflow: hidden;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  background-color: black;
  color: white;
  padding: 8px 16px;
  max-width: 208px;
  white-space: pre;
  position: relative;
  width: 100%;
  justify-content: center;
  gap: 8px;
  border-radius: 6px;
  transition: all 0.3s ease-out;
  border: 3px solid rgb(39, 37, 37);
  cursor: pointer;
}

.custom-button:hover {
  background-color: rgba(0, 0, 0, 0.9);
  box-shadow: 0 0 0 2px black, 0 0 0 4px white;
}

.button-highlight {
  position: absolute;
  right: 0;
  top: -48px;
  height: 128px;
  width: 32px;
  transform: translateX(48px) rotate(12deg);
  background-color: white;
  opacity: 0.1;
  transition: all 1s ease-out;
}

.custom-button:hover .button-highlight {
  transform: translateX(-160px);
}

.button-content {
  display: flex;
  align-items: center;
}

.github-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.button-text {
  margin-left: 4px;
}

.star-count {
  margin-left: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-icon {
  width: 16px;
  height: 16px;
  color: gray;
  transition: color 0.3s;
}

.custom-button:hover .star-icon {
  color: yellow;
}

.count-text {
  font-family: 'Arial', sans-serif;
  font-weight: 500;
  color: white;
}

.user-status {
  width: 12px;
  height: 12px;
  background: #4caf50;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
}

.active-label {
  color: #666;
  font-size: 0.9rem;
}

.profile-info {
  padding: 1.5rem 2rem;
}

.profile-info p {
  margin: 1rem 0;
  padding: 0.8rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: transform 0.2s ease;
}

.profile-info p:hover {
  transform: translateX(8px);
}

.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid #eee;
  background: #fafafa;
  margin-top: 1.5rem;
}

.button-divider {
  width: 1px;
  height: 50px;
  background: linear-gradient(180deg,
      rgba(200, 200, 200, 0) 0%,
      rgba(200, 200, 200, 0.6) 50%,
      rgba(200, 200, 200, 0) 100%);
  margin: 0 1rem;
}

.right-buttons {
  width: 60%;
  display: flex;
  gap: 1rem;
  align-items: center;
  /* 确保所有子元素垂直居中对齐 */
  justify-content: center;
  /* 确保所有子元素水平居中对齐 */
}

.button-container {
  position: relative;
  align-items: center;
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

.bin-bottom,
.logout-button {
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

.logout-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  border-radius: 15px;
  background-color: #ff4d4d;
  cursor: pointer;
  border: 2px solid #ffb3b3;
  transition: all 0.3s ease;
  overflow: hidden;
  padding: 6px;
}

.logout-button svg {
  width: 26px;
  /* 适当缩小图标 */
  height: 26px;
  transform: scale(0.9);
  /* 轻微缩放 */
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
  /* 添加柔和阴影 */
}

.logout-button:hover {
  width: 170px;
  background-color: #ff1a1a;
}

.logout-button:hover {
  animation: bounce 0.8s ease infinite;
}

.logout-button:active {
  transform: scale(0.9);
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

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

/* 悬停扩展效果 */
.bin-button:hover,
.rollback-button:hover {
  width: 170px;
}

.bin-button:hover {
  background-color: rgb(255, 0, 0);
}

.rollback-button:hover {
  background-color: #2E7BFF;
}

.bin-button:hover .bin-top {
  transform: rotate(45deg);
}

/* 点击动画 */
.bin-button:active,
.rollback-button:active {
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
  .rollback-button:hover {
    width: 55px;
  }
}
</style>
