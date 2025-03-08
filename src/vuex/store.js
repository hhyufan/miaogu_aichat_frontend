// store.js
import { createStore } from 'vuex';
import env from '@/util/env.js';
import createPersistedState from 'vuex-persistedstate';
// import router from "@/router/index.js"; // 新增

function getDefaultState() {
    return {
        UserName: false,
        userInfo: {},
        switchState: false,
        token: null,
        refreshToken: null,
        expiresIn: Date.now(), // 重置时会更新为当前时间
        repoStarCount: 0,
        baseURL: null,
        publicKey: null,
        currentInputMsgs: {}
    };
}

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
        publicKey: null,
        currentInputMsgs: {}
    },
    mutations: {
        setCurrentInputMsg(state, { friendId, msg }) {
            state.currentInputMsgs[friendId] = msg;
        },
        setPublicKey(state, token) {
            state.publicKey = token;
        },
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
        },
        resetState(state) {
            const defaultState = getDefaultState();
            Object.keys(defaultState).forEach(key => {
                state[key] = defaultState[key];
            });
        }
    },
    actions: {
        updateBaseUrl({ commit }, url) {
            commit('setBaseUrl', url);
        },
        updatePublicKey({ commit }, token) {
            commit('setPublicKey', token);
        },
        updateUserInfo({ commit }, value) {
            commit("setUserInfo", value);
        },
        toLogin({ commit }) {
            commit('setToken', null);
            window.location.href = env.APP_URL;
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
        },
    },
    getters: {
        isAuthenticated: state => !!state.token, // 判断用户是否已认证
    },
    plugins: [
        // 新增插件配置
        createPersistedState({
            key: 'my-app-storage', // 自定义存储 key
            paths: [
                'token',
                'refreshToken',
                'expiresIn',
                'userInfo',
                'UserName',
                'publicKey',
                'repoStarCount'
            ],
            storage: window.localStorage,

            // 安全过滤（可选）
            reducer: (state) => {
                const { currentInputMsgs, baseURL, ...persistedState } = state;
                return persistedState;
            }
        })
    ]
});

export default store;
