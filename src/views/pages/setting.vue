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
              <svg class="github-icon" viewBox="0 0 438.549 438.549">
                <path
                    d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
                ></path>
              </svg>
              <span class="button-text">Star on GitHub</span>
            </div>
            <div class="star-count">
              <svg
                  class="star-icon"
                  data-slot="icon"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    clip-rule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    fill-rule="evenodd"
                ></path>
              </svg>
              <span class="count-text">{{store.state.repoStarCount}}</span>
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

          <div class="button-container">
            <button class="rollback-button" @click="rollbackChat">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="rollback-icon" viewBox="0 0 16 16">
                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182a.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
              </svg>
              <span class="tooltip">还原聊天记录</span>
            </button>
          </div>

          <div class="button-container">
            <button class="logout-button" @click="exit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24">
                <path
                    d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                    fill="white"
                    stroke="none"
                />
              </svg>
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
import store from "../../vuex/store.js";

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
    if (response.code === 200) {
      await toast.success("成功恢复聊天记录！", { closable: true });
    } else {
      await toast.error("回滚操作失败");
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
  window.open('https://github.com/hhyufan/miaogu_aichat_frontend', '_blank');
};

// Method for logging out
const exit = () => {
  const confirmed = confirm("您确定要退出当前账号？");
  if (confirmed) {
    logout()
        .then(response => {
          if (response.code === 200) {
            toast.success("退出账号成功");
            setTimeout(() => (window.location.href = "/"), 1500);
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

<style lang="scss" scoped src="./setting.scss"/>
