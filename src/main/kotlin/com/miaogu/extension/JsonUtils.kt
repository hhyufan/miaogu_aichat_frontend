package com.miaogu.extension

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.reflect.TypeToken
import com.miaogu.entity.ChatMessage

fun Any.toJson(): String {
    val gson: Gson = GsonBuilder()
        .setPrettyPrinting()
        .create()
    return gson.toJson(this)
}

inline fun <reified T : ChatMessage> String.fromJson(): MutableList<ChatMessage> {
    val gson: Gson = GsonBuilder()
        .setPrettyPrinting()
        .create()
    val type = object : TypeToken<List<T>>() {}.type
    return gson.fromJson(this, type)
}
