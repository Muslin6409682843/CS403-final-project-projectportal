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
-- ปิดการตรวจสอบ foreign key ชั่วคราว
SET FOREIGN_KEY_CHECKS = 0;

-- ลบและสร้างตารางใหม่
DROP TABLE IF EXISTS `finalproject`.`user`;

CREATE TABLE `finalproject`.`user` (
  `UserID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_code` VARCHAR(50) NULL,
  `Username` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  `Name_th` VARCHAR(255) NOT NULL,
  `Name_en` VARCHAR(255) NOT NULL,
  `Gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `Tel` VARCHAR(20) NOT NULL,
  `Email` VARCHAR(100) NOT NULL,
  `Faculty` VARCHAR(100) DEFAULT NULL,
  `Department` VARCHAR(100) DEFAULT NULL,
  `Institute` VARCHAR(255) DEFAULT NULL,
  `Role` ENUM('Student', 'Staff', 'Admin', 'Guest') NOT NULL DEFAULT 'Student',
  `Approved` BOOLEAN DEFAULT FALSE,
  `guest_expire_at` DATETIME DEFAULT NULL,
  `approval_expire_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE INDEX `UserCode_UNIQUE` (`user_code`),
  UNIQUE INDEX `Username_UNIQUE` (`Username`),
  UNIQUE INDEX `Email_UNIQUE` (`Email`),
  CHECK ((Role='Guest' AND Institute IS NOT NULL) OR (Role<>'Guest'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- เปิดการตรวจสอบ foreign key กลับมา
SET FOREIGN_KEY_CHECKS = 1;




-- -----------------------------------------------------
-- Table `finalproject`.`project`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS finalproject.project (
  ProjectID INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title_th VARCHAR(255) NULL DEFAULT NULL,
  title_en VARCHAR(255) NULL DEFAULT NULL,
  abstract_th TEXT NULL,
  abstract_en TEXT NULL,
  keyword_th VARCHAR(255) NULL DEFAULT NULL,
  keyword_en VARCHAR(255) NULL DEFAULT NULL,
  Member VARCHAR(255) NULL DEFAULT NULL,
  advisor VARCHAR(255) NULL DEFAULT NULL,
  Co_advisor VARCHAR(255) NULL DEFAULT NULL,
  file VARCHAR(255) NULL DEFAULT NULL,
  create_date DATETIME NULL DEFAULT NULL,
  category VARCHAR(255) NULL DEFAULT NULL,
  slide_file VARCHAR(255) NULL DEFAULT NULL,
  zip_file VARCHAR(255) NULL DEFAULT NULL,
  github VARCHAR(255) NULL DEFAULT NULL,
  year INT NULL DEFAULT NULL,
  PRIMARY KEY (ProjectID))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `finalproject`.`bookmark`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `finalproject`.`bookmark` (
  `UserID` INT UNSIGNED NOT NULL,
  `ProjectID` INT UNSIGNED NOT NULL,
  `BookmarkDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
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
-- Table `finalproject`.`files`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `finalproject`.`files` (
  `FileID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ProjectID` INT UNSIGNED NOT NULL,
  `FileName` VARCHAR(255) NOT NULL,
  `FileType` VARCHAR(100) NULL DEFAULT NULL,
  `UploadedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`FileID`),
  INDEX `ProjectID` (`ProjectID` ASC) VISIBLE,
  CONSTRAINT `files_ibfk_1`
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
  `ProjectID` INT UNSIGNED NOT NULL,
  `FileID` INT UNSIGNED NOT NULL,
  `DownloadDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`, `ProjectID`, `FileID`, `DownloadDateTime`),
  INDEX `ProjectID` (`ProjectID` ASC) VISIBLE,
  INDEX `FileID` (`FileID` ASC) VISIBLE,
  CONSTRAINT `downloadhistory_ibfk_1`
    FOREIGN KEY (`UserID`)
    REFERENCES `finalproject`.`user` (`UserID`),
  CONSTRAINT `downloadhistory_ibfk_2`
    FOREIGN KEY (`ProjectID`)
    REFERENCES `finalproject`.`project` (`ProjectID`),
  CONSTRAINT `downloadhistory_ibfk_3`
    FOREIGN KEY (`FileID`)
    REFERENCES `finalproject`.`files` (`FileID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `finalproject`.`viewhistory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `finalproject`.`viewhistory` (
  `UserID` INT UNSIGNED NOT NULL,
  `ProjectID` INT UNSIGNED NOT NULL,
  `ViewDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`, `ProjectID`, `ViewDateTime`),
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