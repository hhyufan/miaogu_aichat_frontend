import axiosInstance from '@/axios/axiosInstance';
import store from "@/vuex/store.js";
// 获取好友
export const getFriend = () => {
    return axiosInstance.post(`/friend/friendList`).then(res =>
    {
        return res.data.data.filter(friend => friend.id !== "1001")
    });
};
// 发送聊天消息
export const sendChatMessage = (chatMessage, Type) => {
    return axiosInstance.post(`/${Type}/send`, chatMessage).then(res => res.data);
};

// 获取聊天信息
export const getChatMsg = (Type, requestMessage = {}) => {
    return axiosInstance.post(`/${Type}/messages`, requestMessage, {
        headers: {
            'Content-Type': 'application/json', // 设置请求头
        }
    }).then(res => res.data);
};

// 获取聊天信息
export const getChatMsgCount = (Type) => {
    return axiosInstance.post(`/${Type}/messages`, {}, {
        headers: {
            'Content-Type': 'application/json', // 设置请求头
        }
    }).then(res => res.data);
};
export const clearChatMsg = (params, Type) => {
    return axiosInstance.delete(`/chat/clear`, params).then(res => res.data);
};

export const rollbackChatMsg = (params) => {
    return axiosInstance.post(`/chat/revert`, params).then(res => res.data);
};

export async function getRepoStarCount(params) {
    return axiosInstance.post(`/github/stars`, params).then(async res => {
        await store.dispatch('updateRepoStarCount', +res.data)
    });
}
export const login = (username, password) => {
    return axiosInstance.post(`/user/login`, {username, password},  {
        headers: {
            'Content-Type': 'application/json' // 设置为 JSON
        }
    }).then(async res => {
        if (res.data.code === 200) {
            await processToken(res.data.data)
            await store.dispatch('updateExpiresIn', Date.now() + +res.data.data.expiresIn);
        }
        return res.data
    });
}

// 获取注册请求信息
export const register =async (username, password, email) => {
    return axiosInstance.post(`user/register`, {username, password, email},  {
        headers: {
            'Content-Type': 'application/json' // 设置为 JSON
        }
    }).then(async res => {
        if (res.data.code === 200) {
            await processToken(res.data.data)
            await store.dispatch('updateExpiresIn', Date.now() + +res.data.data.expiresIn);
        }
        return res.data
    });
}

export const logout = async () => {
    return axiosInstance.post(`/user/logout`, null, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async res => {
        await store.dispatch('logout')
        return res.data
    })
}

export const refreshToken = async () => {
    return axiosInstance.post(`/user/refresh`, {
        username: store.state.UserName,
        refreshToken: store.state.refreshToken,
    }, {
        headers: {
            'Content-Type': 'application/json', // 设置请求头
        },
    }).then(res => {
        processToken(res.data.data)
        return res.data
    });
};
export const updateToken = async () => {
    return axiosInstance.post(`/user/token`).then(
        async res => {
            await store.dispatch('updateToken', res.data.data.token)
            return res.data
        }
    )
}
const processToken = async (res) => {
    console.log("res: " + res)
    await store.dispatch('login', res.token);
    await store.dispatch('updateRefreshToken', res.refreshToken);
};
