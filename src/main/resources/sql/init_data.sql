CREATE DATABASE IF NOT EXISTS miaogu_aichat;

USE miaogu_aichat;


-- 创建好友表（如果不存在）
CREATE TABLE IF NOT EXISTS friend (
                                      id VARCHAR(20) NOT NULL PRIMARY KEY,
                                      name VARCHAR(50) NOT NULL,
                                      detail VARCHAR(100)
);

-- 创建ChatGPT 3.5消息表
CREATE TABLE IF NOT EXISTS chat3_5_message (
                                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                               time DATETIME NOT NULL,
                                               msg TEXT NOT NULL,
                                               uid VARCHAR(20) NOT NULL
);

-- 创建ChatGPT 4消息表
CREATE TABLE IF NOT EXISTS chat4_message (
                                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                             time DATETIME NOT NULL,
                                             msg TEXT NOT NULL,
                                             uid VARCHAR(20) NOT NULL
);

-- 插入初始好友数据
INSERT IGNORE INTO friend (id, name, detail) VALUES
                                                    ('1001', 'baka幼犬酱', 'ChatGPT User'),
                                                    ('1002', '日富美', 'ChatGPT3.5'),
                                                    ('1003', '白州梓', 'ChatGPT4o-mini');
