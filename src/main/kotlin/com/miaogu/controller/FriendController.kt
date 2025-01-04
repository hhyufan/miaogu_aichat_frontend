package com.miaogu.controller

import com.miaogu.entity.Friend
import com.miaogu.response.R
import com.miaogu.service.Chat4MessageService
import com.miaogu.service.ChatService
import com.miaogu.service.FriendService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/friend")
class FriendController(
    private val friendService: FriendService
) {
    @GetMapping("/friendList")
    fun friendList(): R<MutableList<Friend>> {
        val messages = friendService.list() // 使用IService的list()方法获取所有消息
        return R.success(messages)
    }
}
