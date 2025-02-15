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
          <div v-show="registerPassword" class="strength-indicator">
            <div class="strength-line-container">
              <div :class="['strength-line', strengthInfo.line]"></div>
            </div>
            <span :class="['strength-text', strengthInfo.textColor]">{{ strengthInfo.text }}</span>
          </div>
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
import {computed, ref} from 'vue';
import { useRouter } from 'vue-router';
import {register, login} from '@/api/getData'
import store from "@/vuex/store.js";
import {toast} from "@/plugins/toast.js";
const router = useRouter();
// 密码强度计算
const passwordStrength = computed(() => {
  const password = registerPassword.value;
  let strength = 0;

  // 长度检查
  if (password.length < 8) return strength;
  // 大写字母检查
  if (/[A-Z]/.test(password)) strength += 1;
  // 小写字母检查
  if (/[a-z]/.test(password)) strength += 1;
  // 数字检查
  if (/[0-9]/.test(password)) strength += 1;
  // 特殊字符检查
  if (/[\W_]/.test(password)) strength += 1;

  return strength;
});

// 强度信息计算
const strengthInfo = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 2) {
    return { line: 'strength-line-weak', text: '弱', textColor: 'strength-text-weak' };
  } else if (strength < 4) {
    return { line: 'strength-line-medium', text: '中', textColor: 'strength-text-medium' };
  } else {
    return { line: 'strength-line-strong', text: '强', textColor: 'strength-text-strong' };
  }
});
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
  if(strengthInfo.value.text === "弱") {
    registerError.value = "密码强度低！"
    return;
  }
  const registerData = register(registerUsername.value, registerPassword.value, email.value)
  registerData.then(response => {
    if (response.code === 200) {
      if (response.data?.token) {
        if(response.data?.user) {
          const userInfo = {...response.data.user, ...{lastLogin: formatBeijingTime()}}
          store.dispatch('updateUserInfo', userInfo);
        }
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
const formatBeijingTime = () => new Date(Date.now() + 288e5).toISOString().replace(/T|\.\d+/g, ' ');
const onLogin = () => {
  const loginData = login(loginUsername.value, loginPassword.value)
  loginData.then(response => {
    if (response.code === 200) {
      if (response.data?.token) {
        if(response.data?.user) {
          const userInfo = {...response.data.user, ...{lastLogin: formatBeijingTime()}}
          store.dispatch('updateUserInfo', userInfo);
        }
        updateVariable(loginUsername)
        router.push({ name: 'ChatHome' });
      } else {
        loginError.value = response.msg
      }
    } else {
      loginError.value = response.msg
    }
  }).catch(error => {
    if(error.status === 429 && error?.response?.data){
      toast.error(error.response.data.message, {closable: true, duration: 2000, debounce: 2500})
      return;
    }
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

<style lang="scss" scoped src="./login.scss"/>
