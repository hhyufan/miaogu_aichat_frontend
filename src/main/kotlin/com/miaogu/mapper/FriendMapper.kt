package com.miaogu.mapper


import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.miaogu.entity.Friend
import org.apache.ibatis.annotations.Mapper

@Mapper
interface FriendMapper : BaseMapper<Friend>
