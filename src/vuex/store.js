// store.js
import { createStore } from 'vuex';

const store = createStore({
    state: {
        UserName: false,
        switchState: false,
        token:  null, // 从 localStorage 获取 JWT
        refreshToken: null,
        expiresIn: Date.now(),
    },
    mutations: {
        setUserName(state, value) {
            state.UserName = value;
        },
        toggleSwitch(state, newValue) {
            state.switchState = newValue; // 更新状态
        },
        setToken(state, token) {
            state.token = token;
        },
        setRefreshToken(state, refreshToken) {
            state.refreshToken = refreshToken;
        },
        clearToken(state) {
            state.token = null;
            state.refreshToken = null;
        },
        setExpiresIn(state, expiresIn) {
            state.expiresIn = expiresIn;
        }
    },
    actions: {

        toLogin({ commit }) {
            commit('setToken', null);
            window.location.href = '/';
        },
        updateUserName({ commit }, value) {
            commit('setUserName', value);
        },
        login({ commit }, token) {
            commit('setToken', token); // 登录时设置 JWT
        },
        updateRefreshToken({ commit }, refreshToken) {
            commit('setRefreshToken', refreshToken);
        },
        logout({ commit }) {
            commit('clearToken'); // 登出时清除 JWT
        },
        updateExpiresIn({ commit }, expiresIn) {
            commit('setExpiresIn', expiresIn);
        },
        updateToken({ commit }, token) {
            commit('setToken', token);
        }
    },
    getters: {
        isAuthenticated: state => !!state.token, // 判断用户是否已认证
    }
});

export default store;
