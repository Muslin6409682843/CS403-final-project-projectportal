-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema finalproject
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema finalproject
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `finalproject` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `finalproject` ;

-- -----------------------------------------------------
-- Table `finalproject`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `UserID` int unsigned NOT NULL AUTO_INCREMENT,
  `user_code` varchar(255) DEFAULT NULL,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Name_th` varchar(255) NOT NULL,
  `Name_en` varchar(255) NOT NULL,
  `Gender` enum('Male','Female','Other') NOT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `faculty` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `Institute` varchar(255) DEFAULT NULL,
  `Role` enum('Student','Staff','Admin','Guest') NOT NULL DEFAULT 'Student',
  `Approved` tinyint(1) DEFAULT '0',
  `guest_expire_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `approval_expire_at` datetime DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username_UNIQUE` (`Username`),
  UNIQUE KEY `Email_UNIQUE` (`email`),
  UNIQUE KEY `unique_user_code` (`user_code`),
  CONSTRAINT `user_chk_1` CHECK ((((`Role` = 'Guest') AND (`Institute` IS NOT NULL)) OR (`Role` <> 'Guest')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `finalproject`.`project`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `ProjectID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title_th` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `abstract_th` text,
  `abstract_en` text,
  `keyword_th` varchar(255) DEFAULT NULL,
  `keyword_en` varchar(255) DEFAULT NULL,
  `Member` varchar(255) DEFAULT NULL,
  `advisor` varchar(255) DEFAULT NULL,
  `Co_advisor` varchar(255) DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `slide_file` varchar(255) DEFAULT NULL,
  `zip_file` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `year` int DEFAULT NULL,
  PRIMARY KEY (`ProjectID`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `finalproject`.`files`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  `FileID` int unsigned NOT NULL AUTO_INCREMENT,
  `ProjectID` bigint unsigned NOT NULL,
  `FileName` varchar(255) NOT NULL,
  `FileType` varchar(100) DEFAULT NULL,
  `UploadedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`FileID`),
  KEY `ProjectID` (`ProjectID`),
  CONSTRAINT `files_ibfk_1` FOREIGN KEY (`ProjectID`) REFERENCES `project` (`ProjectID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `finalproject`.`bookmark`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bookmark`;
CREATE TABLE `bookmark` (
  `UserID` int unsigned NOT NULL,
  `ProjectID` bigint unsigned NOT NULL,
  `bookmark_date` datetime DEFAULT NULL,
  PRIMARY KEY (`UserID`,`ProjectID`),
  KEY `ProjectID` (`ProjectID`),
  CONSTRAINT `bookmark_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `bookmark_ibfk_2` FOREIGN KEY (`ProjectID`) REFERENCES `project` (`ProjectID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `finalproject`.`downloadhistory`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `downloadhistory`;
CREATE TABLE `downloadhistory` (
  `UserID` int unsigned NOT NULL,
  `ProjectID` bigint unsigned NOT NULL,
  `FileID` int unsigned NOT NULL,
  `DownloadDateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`,`ProjectID`,`FileID`,`DownloadDateTime`),
  KEY `ProjectID` (`ProjectID`),
  KEY `FileID` (`FileID`),
  CONSTRAINT `downloadhistory_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `downloadhistory_ibfk_2` FOREIGN KEY (`ProjectID`) REFERENCES `project` (`ProjectID`),
  CONSTRAINT `downloadhistory_ibfk_3` FOREIGN KEY (`FileID`) REFERENCES `files` (`FileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `finalproject`.`viewhistory`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viewhistory`;
CREATE TABLE `viewhistory` (
  `UserID` int unsigned NOT NULL,
  `ProjectID` bigint unsigned NOT NULL,
  `ViewDateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`,`ProjectID`,`ViewDateTime`),
  KEY `ProjectID` (`ProjectID`),
  CONSTRAINT `viewhistory_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `viewhistory_ibfk_2` FOREIGN KEY (`ProjectID`) REFERENCES `project` (`ProjectID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
