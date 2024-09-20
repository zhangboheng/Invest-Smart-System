-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: moneyspeed
-- ------------------------------------------------------
-- Server version	5.7.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `balanceanalytics`
--

DROP TABLE IF EXISTS `balanceanalytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `balanceanalytics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `infoname` varchar(255) DEFAULT NULL,
  `useday` date DEFAULT NULL,
  `money` float DEFAULT NULL,
  `baltype` int(11) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `balanceanalytics`
--

LOCK TABLES `balanceanalytics` WRITE;
/*!40000 ALTER TABLE `balanceanalytics` DISABLE KEYS */;
/*!40000 ALTER TABLE `balanceanalytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blacklistwords`
--

DROP TABLE IF EXISTS `blacklistwords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blacklistwords` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` longtext,
  `remarks` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blacklistwords`
--

LOCK TABLES `blacklistwords` WRITE;
/*!40000 ALTER TABLE `blacklistwords` DISABLE KEYS */;
INSERT INTO `blacklistwords` VALUES (1,'李易峰|清华女|恋童癖|博尔赫斯|亚太报道|天檀FB|钱老炮|陈雨菲|魏晨|倪妮|王鹤棣|刘恺威|陈宇|吴振峰|王子璇|欧阳娜娜|朱梓骁|张翰|黄圣依|马嘉祺|汪苏泷|孟超|王俊凯|张若昀|苏炳添|于月仙|毛不易|马頔|王乐天|董宇辉|鞠婧祎|张凌赫|冉莹颖|张俪|李一桐|马龙|马思纯|唐周|应渊|张远|尹浩宇|李逍遥|赵灵儿|林月如|戴向宇|陈紫函|林更新|赵丽颖|王子异|秦岚|周震南|赵今麦|郭俊辰|黄光裕|王家卫|王菲|祁天道|康辉|韩素希|张馨予|李玟|韦正|阿娇|冯珊珊|唐恬|赵一曼|全红婵|郑秀妍|吴谨言|张智霖|胡歌|王嘉尔|宋敬川|沈小婷|雪允|胡军|祁同伟|侯亮平|张新成|野原广志|沈梦瑶|金佳蓝|于正|张蔷|黄子韬|郑号锡|孟子义|刘谦|董卿|宋亚轩|陈哲远|裴之|裴珠泫|何炅|汪涵|卢锋|刚子|朱媛媛|张栋梁|张子枫|周芯|周密|周也|王圣迪|龚俊|金壮龙|丁文武|谭维维|虞书欣|樊振东|吴宣仪|张常宁|吴冠希|张凯丽|丁程鑫|李斯丹妮|杨幂|蔡徐坤|久哲偷家|李钟硕|赵露思|林朝夕|孙芮|郭艾伦|吴磊|周深|丁泽仁|朱正廷|张歆艺|唐诗逸|招娣|叶诗文|禹英|越妃|辣目洋子|栓Q|维特尔|周公子|赵英俊|谢娜|张杰|甄嬛|安陵容|杨超越|蓝盈莹|范丞丞|陈慧娴|二舅|亲生|姚政|俞灏明|肖战|颜淡|武磊|王姈|万萋萋|程颂|成毅|韩承羽|刘雨昕|李秀满|沉香如屑|保剑锋|曾小贤|胡一菲|诺澜|章若楠|于文文|杨紫|王紫璇|彭昱畅|许凯|王栎鑫|周琦|下单|小鹏|拼多多|阅文起点|紫光|迈巴赫|劳斯莱斯|本田|吉利|丰田|华晨|LG|Redmi|VIVO|vivo|Vivo|优酷|比亚迪|哈弗|魅族|OPPO|华为|小米|凌不疑|张小斐|雷佳音|刘诗诗|刘畊宏|娜扎|星汉灿烂|高福|狐妖小红娘|王者荣耀|降智|陈爽|王一博|石玺彤|程少商|英雄联盟|亡妻|李亚男|王祖蓝|贾乃亮|罗敏|周劼|迪丽热巴|杨洋|傅首尔|失星疯|丁真|钱三一|严嵩|漫展|江宏杰|福原爱|德州扒鸡|蚊子|名将|绿皮火车|wake up|还珠格格|马丽|沈腾|飞信|eBay|泡泡玛特|方丈|易趣网|明日方舟|原神|广寒宫|灵隐寺|饭堂|致知|古筝|坠亡|林妙妙|酱豆子|饶毅|章建华|狗狗','default');
/*!40000 ALTER TABLE `blacklistwords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brainmaplist`
--

DROP TABLE IF EXISTS `brainmaplist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brainmaplist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `publish` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brainmaplist`
--

LOCK TABLES `brainmaplist` WRITE;
/*!40000 ALTER TABLE `brainmaplist` DISABLE KEYS */;
/*!40000 ALTER TABLE `brainmaplist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dailynewslist`
--

DROP TABLE IF EXISTS `dailynewslist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dailynewslist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(128) NOT NULL,
  `href` varchar(2083) NOT NULL,
  `store` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dailynewslist`
--

LOCK TABLES `dailynewslist` WRITE;
/*!40000 ALTER TABLE `dailynewslist` DISABLE KEYS */;
/*!40000 ALTER TABLE `dailynewslist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discountanalytics`
--

DROP TABLE IF EXISTS `discountanalytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discountanalytics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `infoname` varchar(255) DEFAULT NULL,
  `distincttype` varchar(255) DEFAULT NULL,
  `outdate` date DEFAULT NULL,
  `discription` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discountanalytics`
--

LOCK TABLES `discountanalytics` WRITE;
/*!40000 ALTER TABLE `discountanalytics` DISABLE KEYS */;
/*!40000 ALTER TABLE `discountanalytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `editrulestable`
--

DROP TABLE IF EXISTS `editrulestable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `editrulestable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `webname` varchar(20) DEFAULT NULL,
  `rulesname` longtext,
  `content` longtext,
  `baltype` int(11) DEFAULT NULL,
  `catalogue` int(11) DEFAULT NULL,
  `useday` date DEFAULT NULL,
  `action` int(11) DEFAULT NULL,
  `valid` int(11) NOT NULL,
  `classmodel` int(11) NOT NULL,
  `totals` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `editrulestable`
--

LOCK TABLES `editrulestable` WRITE;
/*!40000 ALTER TABLE `editrulestable` DISABLE KEYS */;
INSERT INTO `editrulestable` VALUES (2,'Zhihu','https://api.zhihu.com/topstory/hot-lists/total','-',0,0,'2022-08-26',1,0,1,30),(3,'Tencent','https://i.news.qq.com/trpc.qqnews_web.kv_srv.kv_srv_http_proxy/list?sub_srv_id=finance&srv_id=pc&offset=0&limit=100&strategy=1&ext={%22pool%22:[%22hot%22],%22is_filter%22:2,%22check_type%22:true}','-',0,1,'2022-08-26',1,0,2,76),(4,'Weibo','https://m.weibo.cn/api/container/getIndex?containerid=106003type%3D25%26t%3D3%26disable_hot%3D1%26filter_type%3Drealtimehot','-',0,0,'2022-08-26',1,0,3,53);
/*!40000 ALTER TABLE `editrulestable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experienceshare`
--

DROP TABLE IF EXISTS `experienceshare`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experienceshare` (
  `id` int(1) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` longtext,
  `publish` date DEFAULT NULL,
  `update_art` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experienceshare`
--

LOCK TABLES `experienceshare` WRITE;
/*!40000 ALTER TABLE `experienceshare` DISABLE KEYS */;
/*!40000 ALTER TABLE `experienceshare` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fundsanalytics`
--

DROP TABLE IF EXISTS `fundsanalytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fundsanalytics` (
  `id` varchar(255) NOT NULL,
  `fundname` varchar(255) NOT NULL,
  `manager` varchar(255) DEFAULT NULL,
  `size` float DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `hold` int(11) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fundsanalytics`
--

LOCK TABLES `fundsanalytics` WRITE;
/*!40000 ALTER TABLE `fundsanalytics` DISABLE KEYS */;
/*!40000 ALTER TABLE `fundsanalytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `globalnewstable`
--

DROP TABLE IF EXISTS `globalnewstable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `globalnewstable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `href` varchar(255) DEFAULT NULL,
  `stars` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `globalnewstable`
--

LOCK TABLES `globalnewstable` WRITE;
/*!40000 ALTER TABLE `globalnewstable` DISABLE KEYS */;
/*!40000 ALTER TABLE `globalnewstable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ideaarticles`
--

DROP TABLE IF EXISTS `ideaarticles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ideaarticles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(64) DEFAULT NULL,
  `content` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ideaarticles`
--

LOCK TABLES `ideaarticles` WRITE;
/*!40000 ALTER TABLE `ideaarticles` DISABLE KEYS */;
/*!40000 ALTER TABLE `ideaarticles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insurancecontrol`
--

DROP TABLE IF EXISTS `insurancecontrol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insurancecontrol` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ccode` varchar(64) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `useday` date DEFAULT NULL,
  `baltype` int(11) DEFAULT NULL,
  `publish` varchar(64) DEFAULT NULL,
  `revenue` float DEFAULT NULL,
  `remarks` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insurancecontrol`
--

LOCK TABLES `insurancecontrol` WRITE;
/*!40000 ALTER TABLE `insurancecontrol` DISABLE KEYS */;
/*!40000 ALTER TABLE `insurancecontrol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `investtable`
--

DROP TABLE IF EXISTS `investtable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `investtable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `investname` varchar(64) DEFAULT NULL,
  `useday` date DEFAULT NULL,
  `publish` varchar(64) DEFAULT NULL,
  `revenue` float DEFAULT NULL,
  `baltype` int(11) DEFAULT NULL,
  `remarks` varchar(64) DEFAULT NULL,
  `area` varchar(32) CHARACTER SET armscii8 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investtable`
--

LOCK TABLES `investtable` WRITE;
/*!40000 ALTER TABLE `investtable` DISABLE KEYS */;
/*!40000 ALTER TABLE `investtable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manageruser`
--

DROP TABLE IF EXISTS `manageruser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manageruser` (
  `id` int(11) NOT NULL,
  `loginame` varchar(255) DEFAULT NULL,
  `loginnum` varchar(255) DEFAULT NULL,
  `loginpwd` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manageruser`
--

LOCK TABLES `manageruser` WRITE;
/*!40000 ALTER TABLE `manageruser` DISABLE KEYS */;
INSERT INTO `manageruser` VALUES (1,'Administrator','admin','123456','SU');
/*!40000 ALTER TABLE `manageruser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menulist`
--

DROP TABLE IF EXISTS `menulist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menulist` (
  `id` char(36) NOT NULL,
  `menuname` varchar(255) DEFAULT NULL,
  `pathway` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `imgurl` varchar(255) DEFAULT NULL,
  `positionids` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menulist`
--

LOCK TABLES `menulist` WRITE;
/*!40000 ALTER TABLE `menulist` DISABLE KEYS */;
INSERT INTO `menulist` VALUES ('30bb0876-cec8-11ed-8209-aaaa0019bf5b','投资遴选区','goToMain','/power','../images/iconhuaban1-14.svg',3),('342de472-ceca-11ed-8209-aaaa0019bf5b','待办事项区','goToCal','/todo','../images/iconhuaban1-16.svg',9),('69d6f42d-ceca-11ed-8209-aaaa0019bf5b','头脑风暴区','goToBrain','/brain','../images/iconhuaban1-19.svg',10),('82a13198-cec8-11ed-8209-aaaa0019bf5b','策划谋略区','goToFuture','/idea','../images/iconhuaban1-08.svg',4),('8dcf0832-ceca-11ed-8209-aaaa0019bf5b','系统设置区','goToSettings','/settings','../images/iconhuaban1-13.svg',11),('98154ead-cec9-11ed-8209-aaaa0019bf5b','保险管理区','goToInsurance','/insurance','../images/iconhuaban1-21.svg',7),('b17ced10-cec8-11ed-8209-aaaa0019bf5b','经验总结区','goToExp','/experience','../images/iconhuaban1-02.svg',5),('ba39b2d6-cec7-11ed-8209-aaaa0019bf5b','寰宇新闻区','goToNews','/globalnews','../images/iconhuaban1-12.svg',1),('e90cbdbb-cec9-11ed-8209-aaaa0019bf5b','个人健康区','goToHealth','/health','../images/iconhuaban1-22.svg',8),('f90694a8-cec7-11ed-8209-aaaa0019bf5b','数据分析区','goToAnalytics','/analytics','../images/iconhuaban1-06.svg',2),('fb610f6f-cec8-11ed-8209-aaaa0019bf5b','收支记录区','goToBal','/balance','../images/iconhuaban1-03.svg',6);
/*!40000 ALTER TABLE `menulist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stockanalytics`
--

DROP TABLE IF EXISTS `stockanalytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stockanalytics` (
  `id` varchar(255) NOT NULL,
  `stockname` varchar(255) DEFAULT NULL,
  `ipoday` date DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `category` varchar(32) DEFAULT NULL,
  `inmarket` varchar(10) DEFAULT NULL,
  `revenue` varchar(255) DEFAULT NULL,
  `dividends` int(11) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `rate` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stockanalytics`
--

LOCK TABLES `stockanalytics` WRITE;
/*!40000 ALTER TABLE `stockanalytics` DISABLE KEYS */;
/*!40000 ALTER TABLE `stockanalytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stockinfo`
--

DROP TABLE IF EXISTS `stockinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stockinfo` (
  `id` varchar(6) DEFAULT NULL,
  `name` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stockinfo`
--

LOCK TABLES `stockinfo` WRITE;
/*!40000 ALTER TABLE `stockinfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `stockinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `todolist`
--

DROP TABLE IF EXISTS `todolist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `todolist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `toname` varchar(255) DEFAULT NULL,
  `ordertime` varchar(255) DEFAULT NULL,
  `remainder` varchar(255) DEFAULT NULL,
  `ordertype` int(11) DEFAULT NULL,
  `positionids` int(11) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `todolist`
--

LOCK TABLES `todolist` WRITE;
/*!40000 ALTER TABLE `todolist` DISABLE KEYS */;
/*!40000 ALTER TABLE `todolist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-20 16:16:16
