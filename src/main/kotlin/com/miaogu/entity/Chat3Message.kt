package com.miaogu.entity

import com.baomidou.mybatisplus.annotation.TableId
import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.annotation.JsonFormat
import java.util.Date

@TableName("chat3_5_message")
data class Chat3Message(
    @TableId
    override val id: Long? = null,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    override val time: Date,
    override val msg: String,
    override val uid: String
): ChatMessage
