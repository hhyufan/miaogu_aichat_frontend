package com.miaogu.controller

import com.miaogu.entity.Chat4Message
import com.miaogu.extension.toJson
import com.miaogu.response.R
import com.miaogu.service.Chat4MessageService
import com.miaogu.service.ChatService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/1003")
class Chat4MessageController(
    private val chat4MessageService: Chat4MessageService,
    private val chatService: ChatService
) {

    /**
     * 获取所有聊天3.5消息
     */
    @GetMapping("/messages")
    fun getChat3Messages(): R<List<Chat4Message>> {
        val messages = chat4MessageService.list() // 使用IService的list()方法获取所有消息
        return R.success(messages)
    }
    /**
     * 发送聊天3.5消息
     */
    @PostMapping("/send")
    fun sendChat4Message(@RequestBody chatMessage: Chat4Message): R<String?> {
        val response = chatService.chat(chatMessage, chat4MessageService.list().toJson(), 4)
        chat4MessageService.save(chatMessage) // 使用IService的save()方法
        chat4MessageService.save(response?.let { Chat4Message(null, chatMessage.time, it, "AI") })
        return R.success(response) // 返回成功响应
    }

    @PostMapping("/response")
    fun responseChat3Message(@RequestBody chatMessage: Chat4Message): R<Void> {

        chat4MessageService.save(chatMessage) // 使用IService的save()方法
        return R.success() // 返回成功响应
    }
}
