package com.miaogu.response

enum class ResponseCode(val code: Int, val msg: String) {
    SUCCESS(200, "成功"),
    FAIL(400, "失败"),
    ERROR(500, "服务器错误")
}
