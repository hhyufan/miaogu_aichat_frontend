<template>

  <div class="login">
    <div class="container">
      <div :class="['form-box', changedStyle]">
        <!-- 注册 -->
        <div id="registerForm" ref="registerBox" :class="['register-box', { hidden: isRegisterHidden }]">
          <h1>register</h1>
          <label class="register_input">
            <input name="username" type="text"  v-model="registerUsername" placeholder="用户名">
          </label>
          <label>
            <input name="email" type="email" v-model="email" placeholder="邮箱" required>
          </label>
          <label>
            <input name="password" type="password" v-model="registerPassword" placeholder="密码" onpaste="return false;">
          </label>
          <label>
            <input name="confirmPassword" type="password" v-model="confirmPassword" placeholder="确认密码" onpaste="return false;">
          </label>
          <div id="registerError" class="error-message">{{registerError}}</div>
          <button @click="onRegister">注册</button>
        </div>
        <!-- 登录 -->
        <div id="loginForm" ref="loginBox" :class="['login-box', { hidden: !isRegisterHidden }]">
          <h1>login</h1>
          <label class="login_input">
            <input name="username" type="text" placeholder="用户名" v-model="loginUsername">
          </label>
          <label>
            <input name="password" type="password" placeholder="密码" v-model="loginPassword" onpaste="return false;">
          </label>
          <div id="loginError" class="error-message">{{loginError}}</div>
          <button type="submit" @click="onLogin">登录</button>
        </div>
      </div>
      <div class="con-box left">
        <h2>欢迎来到<span class="span_left">喵咕平台</span></h2>
        <h2>请<span class="span_left">注册</span></h2>
        <img src="@/assets/img/01.jpg" alt="注册">
        <p>已有账号</p>
        <button id="login" @click="ToLogin">去登录</button>
      </div>
      <div class="con-box right">
        <h2>欢迎来到<span class="span_right">喵咕平台</span></h2>
        <h2>请<span class="span_right">登录</span></h2>
        <img src="@/assets/img/02.jpg" alt="登录">
        <p>没有账号？</p>
        <button id="register" @click="ToRegister">去注册</button>
      </div>
      <div class="square">
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div class="circle">
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {register, login} from '@/api/getData'
import store from "@/vuex/store.js";
import {toast} from "@/plugins/toast.js";
const router = useRouter();

// 样式表绑定
const changedStyle = ref("changed-styleA");
const registerBox = ref("register-box");
const loginBox = ref("login-box");

// 控制注册表单的可见性
const isRegisterHidden = ref(true);

// 表单数据绑定
const loginUsername = ref("");
const loginPassword = ref("");
const registerUsername = ref("");
const registerPassword = ref("");
const email = ref("");
const confirmPassword = ref("");

// 错误提示绑定
const loginError = ref("");
const registerError = ref("");

const updateVariable = (value) => {
  store.dispatch('updateUserName', value);
};

const onRegister =  () => {
  if (registerPassword.value !== confirmPassword.value) {
    registerError.value = "密码不一致！"
    return;
  }
  const registerData = register(registerUsername.value, registerPassword.value, email.value)
  registerData.then(response => {
    if (response.code === 200) {
      if (response.data?.token) {
        updateVariable(registerUsername)
        router.push({ name: 'ChatHome' });
      } else {
        registerError.value = response.msg
      }
    } else {
      registerError.value = response.msg
    }
  }).catch(error => {
    toast.error('注册时出错', {error});
  });
}

const onLogin = () => {
  const loginData = login(loginUsername.value, loginPassword.value)
  loginData.then(response => {
    if (response.code === 200) {
      if (response.data?.token) {
        updateVariable(loginUsername)
        router.push({ name: 'ChatHome' });
      } else {
        loginError.value = response.msg
      }
    } else {
      loginError.value = response.msg
    }
  }).catch(error => {
    toast.error("登录时出错", {error})
  });
}
// 去注册
const ToRegister = () => {
  changedStyle.value = "changed-styleB"
  isRegisterHidden.value = false;

  document.body.style.background = 'linear-gradient(200deg,#e3c5eb,#a9c1ed)'; // 设置渐变效果
}

// 去登录
const ToLogin = () => {
  changedStyle.value = "changed-styleA"
  isRegisterHidden.value = true;
  document.body.style.background = 'linear-gradient(200deg, #fbed77, #d8b376)';
}
</script>
<style scoped>
::backdrop {
  background-color: rgba(195, 67, 67, 0.5); /* 半透明背景 */
}
.changed-styleA {
  background-color: #ebc777;
  left: 8%;
}

.changed-styleB {
  background-color: #d3b7d8;
  left: 50%;
}
.login {
  width: 90vw;
  border-radius: 15px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.container {
  width: 55%;
  height: 60%;
  background-color: rgba(255, 255, 255, 0.76);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 5px;
  /* 添加阴影效果 */
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
  /* 设置相对定位 */
  position: fixed;
}

.form-box {
  /* 设置绝对定位 */
  position: fixed;
  top:-4%;
  width: 22vw;
  height: 65vh;
  border-radius: 5px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 设置z-index为2，保证此元素在其他元素之上 */
  z-index: 2;
  /* 添加动画过渡效果，持续时间为0.5秒，缓加速效果 */
  transition: 0.5s ease-in-out;
}

.error-message {
  color: #8e9aaf; /* 文字颜色设置为#8e9aaf */
  font-size: 16px; /* 字体大小为16像素 */
  text-align: left; /* 左对齐文本 */
}

.login-box {
  /* 使用弹性布局，垂直方向排列元素 */
  /* background-color: #ebc777; */
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中对齐 */
  width: 100%; /* 宽度为父元素的100% */
}

.register-box {
  /* 使用弹性布局，垂直方向排列元素 */
  /* background-color: #d3b7d8; */
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中对齐 */
  width: 100%; /* 宽度为父元素的100% */
}

.hidden {
  /* 隐藏该元素 */
  display: none;
  /* 添加过渡效果，持续时间为0.5秒 */
  transition: 0.5s;
}

h1 {
  text-align: center; /* 文本居中对齐 */
  margin-bottom: 25px; /* 底部外边距为25像素 */
  /* 所有字母大写 */
  text-transform: uppercase;
  color: #fff; /* 文本颜色为白色 */
  /* 设置字母之间的间距为5像素 */
  letter-spacing: 5px;
}

h2 {
  margin-top: 8px;
}

input {
  background-color: transparent; /* 背景颜色为透明 */
  width: 70%; /* 输入框宽度为父元素的70% */
  color: #fff; /* 文本颜色为白色 */
  border: none; /* 无边框 */
  /* 仅设置底部边框样式 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  padding: 10px 0; /* 上下内边距为10像素，左右为0 */
  text-indent: 10px; /* 文本缩进10像素 */
  margin: 8px 0; /* 上下外边距为8像素，左右为0 */
  font-size: 14px; /* 字体大小为14像素 */
  /* 设置字母之间的间距为2像素 */
  letter-spacing: 2px;
}

input::placeholder {
  /* 设置占位符文本颜色为白色 */
  color: #fff;
}

.form-box .register-box input:focus {
  color: #a262ad; /* 设置输入框获得焦点时的文本颜色为#a262ad */
  outline: none; /* 无外边框 */
  /* 设置获得焦点时的底部边框颜色 */
  border-bottom: 1px solid #a262ad80;
  /* 添加过渡效果，持续时间为0.5秒 */
  transition: 0.5s;
}

.form-box .login-box input:focus {
  color: #dbb824; /* 设置输入框获得焦点时的文本颜色为#dbb824 */
  outline: none; /* 无外边框 */
  /* 设置获得焦点时的底部边框颜色 */
  border-bottom: 1px solid yellow;
  /* 添加过渡效果，持续时间为0.5秒 */
  transition: 0.5s;
}

input:focus::placeholder {
  /* 当输入框获得焦点时,占位符文本变为透明 */
  opacity: 0;
}

.form-box button {
  /* 按钮宽度设置为父元素的70% */
  width: 70%;
  /* 设置顶部外边距为35像素 */
  margin-top: 35px;
  /* 背景颜色设置为#f6f6f6 */
  background-color: #f6f6f6;
  /* 无外边框 */
  outline: none;
  /* 圆角边框半径为8px */
  border-radius: 8px;
  /* 设置内边距13像素 */
  padding: 13px;
  /* 字体颜色设置为#a262ad */
  color: #a262ad;
  /* 设置字母间距为2px */
  letter-spacing: 2px;
  /* 无边框 */
  border: none;
  /* 指针样式改为手型 */
  cursor: pointer;
}

.form-box .register-box button {
  /* 注册按钮样式与通用按钮相同 */
  width: 50%;
  margin-top: 35px;
  background: #f6f6f6;
  outline: none;
  border-radius: 8px;
  padding: 13px;
  color: #a262ad;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;
}

.form-box .login-box button {
  /* 登录按钮样式与通用按钮相同 */
  width: 70%;
  margin-top: 35px;
  background: #f6f6f6;
  outline: none;
  border-radius: 8px;
  padding: 13px;
  color: #dbb824;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;
}

.form-box .register-box button:hover {
  /* 注册按钮悬停样式 */
  background: #a262ad;
  color: #f6f6f6;
  transition: background-color 0.5s ease;
}

.form-box .login-box button:hover {
  /* 登录按钮悬停样式 */
  background: #dbb824;
  color: #f6f6f6;
  transition: background-color 0.5s ease;
}

.form-box button:hover {
  /* 通用按钮悬停样式 */
  background: #a262ad;
  color: #f6f6f6;
  transition: background-color 0.5s ease;
}

.con-box {
  width: 60%;
  /* 弹性布局，垂直排列，居中对齐 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* 绝对定位，垂直居中 */
  position: absolute;
  top: 50%;

  transform: translateY(-50%);
}

.con-box.left {
  /* 设置左对齐位置偏移-2% */
  left: -2%;

}

.con-box.left button {
  color: #a262ad; /* 按钮字体颜色为#a262ad */
  border: 1px solid #d3b7d8; /* 按钮边框颜色为#d3b7d8 */
}

.con-box.right {
  /* 设置右对齐位置偏移-2% */
  right: -2%;
}

.con-box.right button {
  color: #dbb824; /* 按钮字体颜色为#dbb824 */
  border: 1px solid #f2ee65; /* 按钮边框颜色为#f2ee65 */
}

.con-box h2 {
  /* 标题样式 */
  color: #8e9aaf;
  font-size: 25px;
  font-weight: bold; /* 字体加粗 */
  letter-spacing: 3px;
  text-align: center; /* 文本居中对齐 */
  margin-bottom: 4px; /* 底部外边距为4像素 */
}

.con-box p {
  /* 段落样式 */
  font-size: 12px;
  letter-spacing: 2px; /* 字母间距为2像素 */
  color: #8e9aaf;
  text-align: center; /* 文本居中对齐 */
}

.con-box span {
  color: #d3b7d8;
}

.con-box .span_left {
  color: #d3b7d8;
}

.con-box .span_right {
  color: #ebc777;
}

.con-box img {
  /* 图片样式 */
  width: 150px; /* 图片宽度为150像素 */
  height: 150px; /* 图片高度为150像素 */
  opacity: 0.9; /* 图片透明度为0.9 */
  margin: 40px 0; /* 垂直外边距为40像素，左右外边距为0 */
}

.con-box button {
  /* 通用按钮样式 */
  margin-top: 3%;
  background-color: #fff;
  color: #a262ad;
  border: 1px solid #d3b7d8; /* 边框颜色为#d3b7d8 */
  padding: 6px 10px; /* 内边距为上下6像素，左右10像素 */
  border-radius: 5px; /* 圆角边框半径为5像素 */
  letter-spacing: 1px; /* 字母间距为1像素 */
  outline: none; /* 无外边框 */
  cursor: pointer; /* 指针样式改为手形 */
}

.con-box.left button:hover {
  /* 左侧按钮悬停样式 */
  background-color: #d3b7d8;
  color: #fff;
}

.con-box.right button:hover {
  /* 右侧按钮悬停样式 */
  background-color: #ebc777;
  color: #fff;
}

ul li {
  /* 列表项样式 */
  position: absolute; /* 设置绝对定位 */
  border: 1px solid #fff; /* 边框颜色为白色 */
  background-color: #fff;
  width: 30px; /* 列表项宽度为30像素 */
  height: 30px; /* 列表项高度为30像素 */
  list-style: none; /* 去掉默认的列表样式 */
  opacity: 0; /* 初始透明度为0 */
}

.square, .circle {
  position: absolute; /* 设置绝对定位 */
  z-index: -1; /* 设置为后层，使在所有元素之下 */
}

.square li {
  /* 正方形列表项动画样式 */
  top: 40vh; /* 垂直位置为视口高度的40% */
  left: 60vw; /* 水平位置为视口宽度的60% */
  /* 执行动画，动画名称为square，持续10秒，线性变化，无限次播放 */
  animation: square 10s linear infinite;
}

.square li:nth-child(2) {
  /* 第二个正方形列表项 */
  top: 80vh; /* 垂直位置为视口高度的80% */
  left: 10vw; /* 水平位置为视口宽度的10% */
  /* 设置动画延迟时间为2秒 */
  animation-delay: 2s;
}

.square li:nth-child(3) {
  /* 第三个正方形列表项 */
  top: 80vh; /* 垂直位置为视口高度的80% */
  left: 85vw; /* 水平位置为视口宽度的85% */
  /* 设置动画延迟时间为4秒 */
  animation-delay: 4s;
}

.square li:nth-child(4) {
  /* 第四个正方形列表项 */
  top: 10vh; /* 垂直位置为视口高度的10% */
  left: 70vw; /* 水平位置为视口宽度的70% */
  /* 设置动画延迟时间为6秒 */
  animation-delay: 6s;
}

.square li:nth-child(5) {
  /* 第五个正方形列表项 */
  top: 10vh; /* 垂直位置为视口高度的10% */
  left: 10vw; /* 水平位置为视口宽度的10% */
  /* 设置动画延迟时间为8秒 */
  animation-delay: 8s;
}

.circle li {
  /* 圆形列表项动画样式 */
  bottom: 0; /* 初始垂直位置为底部 */
  left: 15vw; /* 初始水平位置为视口宽度的15% */
  /* 执行动画，动画名称为circle，持续10秒，线性变化，无限次播放 */
  animation: circle 10s linear infinite;
}

.circle li:nth-child(2) {
  /* 第二个圆形列表项 */
  left: 35vw; /* 初始水平位置为视口宽度的35% */
  /* 设置动画延迟时间为2秒 */
  animation-delay: 2s;
}

.circle li:nth-child(3) {
  /* 第三个圆形列表项 */
  left: 55vw; /* 初始水平位置为视口宽度的55% */
  /* 设置动画延迟时间为6秒 */
  animation-delay: 6s;
}

.circle li:nth-child(4) {
  /* 第四个圆形列表项 */
  left: 75vw; /* 初始水平位置为视口宽度的75% */
  /* 设置动画延迟时间为4秒 */
  animation-delay: 4s;
}

.circle li:nth-child(5) {
  /* 第五个圆形列表项 */
  left: 90vw; /* 初始水平位置为视口宽度的90% */
  /* 设置动画延迟时间为8秒 */
  animation-delay: 8s;
}

/* 定义square动画 */
@keyframes square {
  0% {
    transform: scale(0) rotateY(0deg); /* 初始缩放为0，旋转度数为0 */
    opacity: 1; /* 初始透明度为1 */
  }
  100% {
    transform: scale(5) rotateY(1000deg); /* 最终缩放为5倍，旋转度数为1000度 */
    opacity: 0; /* 最终透明度为0 */
  }
}

/* 定义circle动画 */
@keyframes circle {
  0% {
    transform: scale(0) rotateY(0deg); /* 初始缩放为0，旋转度数为0 */
    opacity: 1; /* 初始透明度为1 */
    bottom: 0; /* 初始位置在底部 */
    border-radius: 0; /* 初始边框半径为0 */
  }
  100% {
    transform: scale(5) rotateY(1000deg); /* 最终缩放为5倍，旋转度数为1000度 */
    opacity: 0; /* 最终透明度为0 */
    bottom: 90vh; /* 最终位置在视口高度的90%处 */
    border-radius: 50%; /* 最终边框半径为50%（圆形） */
  }
}

/* 添加媒体查询以适应不同屏幕尺寸 */
@media (max-width: 768px) {
  .container {
    width: 90%; /* 在小屏幕上使用较小的宽度 */
    height: auto; /* 高度自适应 */
  }

  .form-box {
    width: 90%; /* 表单框宽度自适应 */
    height: auto; /* 高度自适应 */
  }

  .con-box {
    width: 100%; /* 内容框宽度自适应 */
    padding: 10px; /* 添加一些内边距 */
  }

  h1, h2 {
    font-size: 1.5em; /* 字体大小自适应 */
  }

  input {
    width: 90%; /* 输入框宽度自适应 */
  }

  button {
    width: 90%; /* 按钮宽度自适应 */
  }
}

</style>
