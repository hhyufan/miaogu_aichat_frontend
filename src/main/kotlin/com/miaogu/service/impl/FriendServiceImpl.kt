package com.miaogu.service.impl

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl
import com.miaogu.entity.Friend
import com.miaogu.mapper.FriendMapper
import com.miaogu.service.FriendService
import org.springframework.stereotype.Service

@Service
class FriendServiceImpl : ServiceImpl<FriendMapper, Friend>(), FriendService

