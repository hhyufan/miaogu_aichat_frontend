import base from './index';
import axiosInstance from '@/axios/axiosInstance';
import store from "@/vuex/store.js";
// 获取好友
export const getFriend = async () => {
    const {baseUrl} = await base;
    return axiosInstance.post(`${baseUrl}/friend/friendList`).then(res => {
        return res.data.data.filter(friend => friend.id !== "1001")
    });
};
// 发送聊天消息
export const sendChatMessage = async (chatMessage, Type) => {
    const {baseUrl} = await base;
    return axiosInstance.post(`${baseUrl}/${Type}/send`, chatMessage).then(res => res.data);
};

// 获取聊天信息
export const getChatMsg = async (Type, requestMessage = {}) => {
    const {baseUrl} = await base;
    return axiosInstance.post(`${baseUrl}/${Type}/messages`, requestMessage, {
        headers: {
            'Content-Type': 'application/json', // 设置请求头
        }
    }).then(res => res.data);
};

// 获取聊天信息
export const getChatMsgCount = async (Type) => {
    const {baseUrl} = await base;
    return axiosInstance.post(`${baseUrl}/${Type}/messages`, {}, {
        headers: {
            'Content-Type': 'application/json', // 设置请求头
        }
    }).then(res => res.data);
};
export const clearChatMsg = async (params) => {
    const {baseUrl} = await base;
    return axiosInstance.delete(`${baseUrl}/chat/clear`, params).then(res => res.data);
};

export const rollbackChatMsg = async (params) => {
    const {baseUrl} = await base;
    return axiosInstance.post(`${baseUrl}/chat/revert`, params).then(res => res.data);
};

export async function getRepoStarCount(params) {
    const {baseUrl} = await base;
    return axiosInstance.post(`${baseUrl}/github/stars`, params).then(async res => {
        await store.dispatch('updateRepoStarCount', +res.data)
    });
}
export const login = async (username, password) => {
    const {baseUrl} = await base;
    return axiosInstance.post(`${baseUrl}/user/login`, {username, password}, {
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
    const {baseUrl} = await base;
    return axiosInstance.post(`${baseUrl}/user/register`, {username, password, email},  {
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
    const {baseUrl} = await base;
    return axiosInstance.post(`${baseUrl}/user/logout`, null, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async res => {
        await store.dispatch('logout')
        return res.data
    })
}

export const refreshToken = async () => {
    const {baseUrl} = await base;
    return axiosInstance.post(`${baseUrl}/user/refresh`, {
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
    const {baseUrl} = await base;
    return axiosInstance.post(`${baseUrl}/user/token`).then(
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
