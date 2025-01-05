// store.js
import { createStore } from 'vuex';

const store = createStore({
    state: {
        UserName: false
    },
    mutations: {
        setUserName(state, value) {
            state.UserName = value;
        }
    },
    actions: {
        updateUserName({ commit }, value) {
            commit('setUserName', value);
        }
    }
});

export default store;
