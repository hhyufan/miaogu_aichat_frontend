package com.miaogu

import org.springframework.boot.CommandLineRunner
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component
import java.nio.file.Files
import java.nio.file.Paths

@Component
class DatabaseInitializer(private val jdbcTemplate: JdbcTemplate) : CommandLineRunner {

    override fun run(vararg args: String?) {
        initializeDatabase()
    }

    private fun initializeDatabase() {
        val sqlFilePath = "src/main/resources/sql/init_data.sql" // SQL文件的路径
        val sql = Files.readString(Paths.get(sqlFilePath))

        // Execute the SQL script
        sql.split(";").forEach {
            if (it.isNotBlank()) {
                jdbcTemplate.execute(it.trim())
            }
        }
    }
}
