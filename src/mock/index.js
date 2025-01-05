import Mock from "mockjs";

const success = {
    code: 200,
    msg: "success",
    data: {
        username: "wee",
        password: "123456"
    }
}


const error1 = {
   code: 200,
    msg: "用户名或密码错误",
    data: null
}

const error2 = {
    code: 200,
    msg: "用户名已存在",
    data: null
}


// Mock.mock(/user\/login/, 'post', () => {
//     return error1;
// });
//
// Mock.mock(/user\/register/, 'post', () => {
//     return error2;
// });
