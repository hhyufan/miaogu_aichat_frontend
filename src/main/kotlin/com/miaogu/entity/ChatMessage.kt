package com.miaogu.entity

import java.util.*

interface ChatMessage {
    val id: Long?
    val time: Date
    val msg: String
    val uid: String
}
