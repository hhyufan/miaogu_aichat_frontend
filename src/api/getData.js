import base from './index';
import axios from 'axios';

const baseUrl = base.baseUrl;

// 获取好友
export const getFriend = (params) => {
    return axios.get(`${baseUrl}/friend/friendList`, params).then(res =>
    {

        return res.data.data.filter(friend => friend.id !== "1001")
    });
};
// 发送聊天消息
export const sendChatMessage = (chatMessage, Type) => {
    return axios.post(`${baseUrl}/${Type}/send`, chatMessage).then(res => res.data);
};

// 获取聊天信息
export const getChatMsg = (params, Type) => {
    return axios.get(`${baseUrl}/${Type}/messages`, params).then(res => res.data);
};

export const clearChatMsg = (params, Type) => {
    return axios.delete(`${baseUrl}/chat/clear`, params).then(res => res.data);
};

// 获取登录请求信息
export const login = (username, password) => {
    return axios.post(`${baseUrl}/user/login`, {username, password},  {
        headers: {
            'Content-Type': 'application/json' // 设置为 JSON
        }
    }).then(res => res.data);
}

// 获取注册请求信息
export const register = (username, password, email) => {
    return axios.post(`${baseUrl}/user/register`, {username, password, email},  {
        headers: {
            'Content-Type': 'application/json' // 设置为 JSON
        }
    }).then(res => res.data);
}
