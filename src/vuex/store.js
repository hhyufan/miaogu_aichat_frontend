// store.js
import { createStore } from 'vuex';

const store = createStore({
    state: {
        UserName: false,
        switchState: false
    },
    mutations: {
        setUserName(state, value) {
            state.UserName = value;
        },
        toggleSwitch(state, newValue) {
            state.switchState = newValue; // 更新状态
        }
    },
    actions: {
        updateUserName({ commit }, value) {
            commit('setUserName', value);
        }
    }
});

export default store;
