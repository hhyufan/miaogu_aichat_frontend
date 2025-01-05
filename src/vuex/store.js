// store.js
import { createStore } from 'vuex';

const store = createStore({
    state: {
        UserName: 'Initial Value'
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
