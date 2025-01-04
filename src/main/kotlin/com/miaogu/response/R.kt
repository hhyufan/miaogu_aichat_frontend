package com.miaogu.response

data class R<T>(
    val code: Int,
    val msg: String? = null,
    val data: T? = null
) {
    companion object {
        fun <T> success(): R<T> {
            return R(ResponseCode.SUCCESS.code)
        }

        fun <T> success(msg: String): R<T> {
            return R(ResponseCode.SUCCESS.code, msg)
        }

        fun <T> success(data: T): R<T> {
            return R(ResponseCode.SUCCESS.code, ResponseCode.SUCCESS.msg, data)
        }

        fun <T> fail(): R<T> {
            return R(ResponseCode.FAIL.code)
        }

        fun <T> fail(msg: String): R<T> {
            return R(ResponseCode.FAIL.code, msg)
        }

        fun <T> fail(data: T): R<T> {
            return R(ResponseCode.FAIL.code, ResponseCode.FAIL.msg, data)
        }

        fun fail(code: Int, msg: String): R<Nothing> {
            return R(code, msg)
        }
    }
}
