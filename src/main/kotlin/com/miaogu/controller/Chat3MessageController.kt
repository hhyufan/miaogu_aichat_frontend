package com.miaogu.controller

import com.miaogu.entity.Chat3Message
import com.miaogu.extension.toJson
import com.miaogu.response.R
import com.miaogu.service.Chat3MessageService
import com.miaogu.service.ChatService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/1002")
class Chat3MessageController(
    private val chat3MessageService: Chat3MessageService,
    private val chatService: ChatService
) {

    /**
     * 获取所有聊天3.5消息
     */
    @GetMapping("/messages")
    fun getChat3Messages(): R<List<Chat3Message>> {
        val messages = chat3MessageService.list() // 使用IService的list()方法获取所有消息
        return R.success(messages)
    }
    /**
     * 发送聊天3.5消息
     */
    @PostMapping("/send")
    fun sendChat3Message(@RequestBody chatMessage: Chat3Message): R<String?> {
        val response = chatService.chat(chatMessage, chat3MessageService.list().toJson(), 3)
        chat3MessageService.save(chatMessage) // 使用IService的save()方法
        chat3MessageService.save(response?.let { Chat3Message(null, chatMessage.time, it, "AI") })
        return R.success(response) // 返回成功响应
    }

    @PostMapping("/response")
    fun responseChat3Message(@RequestBody chatMessage: Chat3Message): R<Void> {

        chat3MessageService.save(chatMessage) // 使用IService的save()方法
        return R.success() // 返回成功响应
    }
}
