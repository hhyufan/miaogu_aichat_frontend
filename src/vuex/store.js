// store.js
import { createStore } from 'vuex';

const store = createStore({
    state: {
        UserName: false,
        userInfo: {},
        switchState: false,
        token:  null, // 从 localStorage 获取 JWT
        refreshToken: null,
        expiresIn: Date.now(),
        repoStarCount: 0,
        baseURL: null,
    },
    mutations: {
        setBaseUrl(state, url) {
            state.baseURL = url;
        },
        setUserInfo(state, value) {
            state.userInfo = value;
        },
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
        },
        setRepoStarCount(state, repoStarCount) {
            state.repoStarCount = repoStarCount
        }
    },
    actions: {
        updateBaseUrl({ commit }, url) {
            commit('setBaseUrl', url);
        },
        updateUserInfo({ commit }, value) {
            commit("setUserInfo", value);
        },
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
        },
        updateRepoStarCount({ commit }, repoStarCount) {
            commit('setRepoStarCount', repoStarCount)
        }
    },
    getters: {
        isAuthenticated: state => !!state.token, // 判断用户是否已认证
    }
});

export default store;
