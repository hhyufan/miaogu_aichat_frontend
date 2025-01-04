package com.miaogu.entity

import com.baomidou.mybatisplus.annotation.TableId
import com.baomidou.mybatisplus.annotation.TableName

@TableName("friend")
data class Friend(
    @TableId
    val id: String,
    val name: String,
    val detail: String? = null
)
