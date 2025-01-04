package com.miaogu.service.impl

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl
import com.miaogu.entity.Chat4Message
import com.miaogu.mapper.Chat4MessageMapper
import com.miaogu.service.Chat4MessageService
import org.springframework.stereotype.Service

@Service
class Chat4MessageServiceImpl : ServiceImpl<Chat4MessageMapper, Chat4Message>(), Chat4MessageService
