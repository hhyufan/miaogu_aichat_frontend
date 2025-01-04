USE miaogu_aichat;

DROP DATABASE IF EXISTS miaogu_aichat;
CREATE DATABASE miaogu_aichat;
DROP TABLE IF EXISTS chat_message;
DROP TABLE IF EXISTS friend;

-- 创建好友表（如果不存在）
CREATE TABLE friend (
                                      id VARCHAR(20) NOT NULL PRIMARY KEY,
                                      name VARCHAR(50) NOT NULL,
                                      detail VARCHAR(100)
);

-- 创建ChatGPT 3.5消息表
CREATE TABLE  chat3_5_message (
                                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                               time DATETIME NOT NULL,
                                               msg TEXT NOT NULL,
                                               uid VARCHAR(20) NOT NULL
);

-- 创建ChatGPT 4消息表
CREATE TABLE chat4_message (
                                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                             time DATETIME NOT NULL,
                                             msg TEXT NOT NULL,
                                             uid VARCHAR(20) NOT NULL
);

-- 插入初始好友数据
INSERT INTO friend (id, name, detail) VALUES
                                                    ('1001', 'baka幼犬酱', 'ChatGPT User'),
                                                    ('1002', '日富美', 'ChatGPT3.5'),
                                                    ('1003', '白州梓', 'ChatGPT4o-mini');

-- 插入初始聊天记录（ChatGPT 3.5）
INSERT INTO chat3_5_message (time, msg, uid) VALUES
                                                 ('2023-01-01 09:12:00', '在吗？', '1001'),
                                                 ('2023-01-01 09:12:00', '怎么了？', '1002');

-- 插入初始聊天记录（ChatGPT 4）
INSERT INTO chat4_message (time, msg, uid) VALUES
                                               ('2023-01-01 09:12:00', '在干嘛呢', '1001'),
                                               ('2023-01-01 09:12:00', '吃饭', '1002');
