package com.miaogu.service

import com.miaogu.entity.Chat3Message
import com.miaogu.entity.Chat4Message
import com.miaogu.entity.ChatMessage
import com.miaogu.extension.fromJson
import com.miaogu.extension.toJson
import org.springframework.ai.chat.client.ChatClient
import org.springframework.ai.chat.client.ChatClient.PromptUserSpec
import org.springframework.ai.chat.model.ChatModel
import org.springframework.ai.openai.OpenAiChatOptions
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.stream.Collectors


@Service
class ChatService @Autowired constructor(model: ChatModel){

    private val chatClient: ChatClient = ChatClient.builder(model).build()
    fun chat(message: ChatMessage, chatHistory: String, model: Int): String? {
        val modelName = when (model) {
            3 -> "gpt-3.5-turbo"
            4 -> "gpt-4o-mini"
            else -> "gpt-3.5-turbo"
        }
        val historyMessage: MutableList<ChatMessage> = if (model == 3) chatHistory.fromJson<Chat3Message>() else chatHistory.fromJson<Chat4Message>()
        // 将用户消息添加到聊天记录中
        historyMessage.add(message)
        val userMessage = message.msg + "\n后面内容作为附加聊天记录，不是当前要回答的内容：" + historyMessage.toJson()
        val responseFlux = chatClient.prompt()
            .options(OpenAiChatOptions.builder().model(modelName).build())
            .user { u: PromptUserSpec -> u.text(userMessage) }
            .stream()
            .content()

        val response: String? = responseFlux.collectList().block()?.stream()?.collect(Collectors.joining())

        // 将 AI 的响应添加到聊天记录中
        historyMessage.add(message)

        // 返回 AI 的响应
        return response
    }
}
