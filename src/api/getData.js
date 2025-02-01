import base from './index';
const baseUrl = base.baseUrl;
import axiosInstance from '@/axios/axiosInstance';
import store from "@/vuex/store.js";
// 获取好友
export const getFriend = () => {
    return axiosInstance.post(`${baseUrl}/friend/friendList`).then(res =>
    {
        return res.data.data.filter(friend => friend.id !== "1001")
    });
};
// 发送聊天消息
export const sendChatMessage = (chatMessage, Type) => {
    return axiosInstance.post(`${baseUrl}/${Type}/send`, chatMessage).then(res => res.data);
};

// 获取聊天信息
export const getChatMsg = (params, Type) => {
    return axiosInstance.post(`${baseUrl}/${Type}/messages`).then(res => res.data);
};

export const clearChatMsg = (params, Type) => {
    return axiosInstance.delete(`${baseUrl}/chat/clear`, params).then(res => res.data);
};

export const rollbackChatMsg = (params) => {
    return axiosInstance.post(`${baseUrl}/chat/revert`, params).then(res => res.data);
};

export async function getRepoStarCount(owner, repo) {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        const data = await response.json();
        console.log(JSON.stringify(data))

        if (response.ok) {
            await store.dispatch('updateRepoStarCount', data["stargazers_count"]);
        } else {
            console.error(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Failed to fetch repository data:', error);
    }
}

// 获取登录请求信息
export const login = (username, password) => {
    return axiosInstance.post(`${baseUrl}/user/login`, {username, password},  {
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
export const refreshToken = async () => {
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
