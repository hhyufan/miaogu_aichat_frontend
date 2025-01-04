package com.miaogu

import org.mybatis.spring.annotation.MapperScan
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
@MapperScan("com.miaogu.mapper")
class MiaoguAichatApplication

fun main(args: Array<String>) {
    runApplication<MiaoguAichatApplication>(*args)
}
