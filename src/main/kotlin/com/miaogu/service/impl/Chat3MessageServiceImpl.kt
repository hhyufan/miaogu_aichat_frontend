package com.miaogu.service.impl

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl
import com.miaogu.entity.Chat3Message
import com.miaogu.mapper.Chat3MessageMapper
import com.miaogu.service.Chat3MessageService
import org.springframework.stereotype.Service

@Service
class Chat3MessageServiceImpl : ServiceImpl<Chat3MessageMapper, Chat3Message>(), Chat3MessageService
