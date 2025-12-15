-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema finalproject
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `finalproject` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `finalproject` ;

-- -----------------------------------------------------
-- Table `finalproject`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `finalproject`.`user` (
  `UserID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_code` VARCHAR(255) NULL DEFAULT NULL,
  `Username` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  `Name_th` VARCHAR(255) NOT NULL,
  `Name_en` VARCHAR(255) NOT NULL,
  `Gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `tel` VARCHAR(255) NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `faculty` VARCHAR(255) NULL DEFAULT NULL,
  `department` VARCHAR(255) NULL DEFAULT NULL,
  `Institute` VARCHAR(255) NULL DEFAULT NULL,
  `Role` ENUM('Student', 'Staff', 'Admin', 'Guest') NOT NULL DEFAULT 'Student',
  `Approved` TINYINT(1) NULL DEFAULT '0',
  `guest_expire_at` DATETIME NULL DEFAULT NULL,
  `approval_expire_at` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE INDEX `Username_UNIQUE` (`Username` ASC) VISIBLE,
  UNIQUE INDEX `Email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `unique_user_code` (`user_code` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `finalproject`.`project`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `finalproject`.`project` (
  `ProjectID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title_th` VARCHAR(255) NULL DEFAULT NULL,
  `title_en` VARCHAR(255) NULL DEFAULT NULL,
  `abstract_th` TEXT NULL DEFAULT NULL,
  `abstract_en` TEXT NULL DEFAULT NULL,
  `keyword_th` VARCHAR(255) NULL DEFAULT NULL,
  `keyword_en` VARCHAR(255) NULL DEFAULT NULL,
  `Member` VARCHAR(255) NULL DEFAULT NULL,
  `advisor` VARCHAR(255) NULL DEFAULT NULL,
  `Co_advisor` VARCHAR(255) NULL DEFAULT NULL,
  `file` VARCHAR(255) NULL DEFAULT NULL,
  `create_date` DATETIME NULL DEFAULT NULL,
  `category` VARCHAR(255) NULL DEFAULT NULL,
  `slide_file` VARCHAR(255) NULL DEFAULT NULL,
  `zip_file` VARCHAR(255) NULL DEFAULT NULL,
  `github` VARCHAR(255) NULL DEFAULT NULL,
  `year` INT NULL DEFAULT NULL,
  `uploaded_date` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`ProjectID`))
ENGINE = InnoDB
AUTO_INCREMENT = 38
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `finalproject`.`bookmark`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `finalproject`.`bookmark` (
  `UserID` INT UNSIGNED NOT NULL,
  `ProjectID` BIGINT UNSIGNED NOT NULL,
  `bookmark_date` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`UserID`, `ProjectID`),
  INDEX `ProjectID` (`ProjectID` ASC) VISIBLE,
  CONSTRAINT `bookmark_ibfk_1`
    FOREIGN KEY (`UserID`)
    REFERENCES `finalproject`.`user` (`UserID`),
  CONSTRAINT `bookmark_ibfk_2`
    FOREIGN KEY (`ProjectID`)
    REFERENCES `finalproject`.`project` (`ProjectID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `finalproject`.`downloadhistory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `finalproject`.`downloadhistory` (
  `UserID` INT UNSIGNED NOT NULL,
  `ProjectID` BIGINT UNSIGNED NOT NULL,
  `DownloadDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `download_date_time` DATETIME(6) NOT NULL,
  PRIMARY KEY (`UserID`, `ProjectID`, `DownloadDateTime`),
  INDEX `ProjectID` (`ProjectID` ASC) VISIBLE,
  CONSTRAINT `downloadhistory_ibfk_1`
    FOREIGN KEY (`UserID`)
    REFERENCES `finalproject`.`user` (`UserID`),
  CONSTRAINT `downloadhistory_ibfk_2`
    FOREIGN KEY (`ProjectID`)
    REFERENCES `finalproject`.`project` (`ProjectID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `finalproject`.`viewhistory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `finalproject`.`viewhistory` (
  `UserID` INT UNSIGNED NOT NULL,
  `ProjectID` BIGINT UNSIGNED NOT NULL,
  `view_date_time` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`UserID`, `ProjectID`),
  INDEX `ProjectID` (`ProjectID` ASC) VISIBLE,
  CONSTRAINT `viewhistory_ibfk_1`
    FOREIGN KEY (`UserID`)
    REFERENCES `finalproject`.`user` (`UserID`),
  CONSTRAINT `viewhistory_ibfk_2`
    FOREIGN KEY (`ProjectID`)
    REFERENCES `finalproject`.`project` (`ProjectID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;