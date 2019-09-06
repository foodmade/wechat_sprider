/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80011
 Source Host           : 127.0.0.1:3306
 Source Schema         : crawler

 Target Server Type    : MySQL
 Target Server Version : 80011
 File Encoding         : 65001

 Date: 06/09/2019 23:44:33
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for wechat_article
-- ----------------------------
DROP TABLE IF EXISTS `wechat_article`;
CREATE TABLE `wechat_article` (
  `article_title` varchar(50) DEFAULT NULL COMMENT '文章标题',
  `aid` varchar(50) DEFAULT NULL COMMENT 'aid',
  `cover` varchar(255) DEFAULT NULL COMMENT '文章预览图地址',
  `link` varchar(255) DEFAULT NULL COMMENT '文章地址',
  `digest` varchar(255) DEFAULT NULL COMMENT '文章概述',
  `appmsgid` bigint(20) NOT NULL COMMENT '文章id',
  `type` varchar(10) DEFAULT NULL,
  `copyright_stat` varchar(50) DEFAULT NULL,
  `author` varchar(50) DEFAULT NULL COMMENT '作者昵称',
  `sendtime` varchar(100) DEFAULT NULL COMMENT '文章发布时间',
  `like_num` bigint(20) DEFAULT NULL COMMENT '点赞数',
  `read_num` bigint(20) DEFAULT NULL COMMENT '阅读数',
  `comment_num` bigint(20) DEFAULT NULL COMMENT '评论数',
  PRIMARY KEY (`appmsgid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
