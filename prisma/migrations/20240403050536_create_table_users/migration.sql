-- CreateTable
CREATE TABLE `users` (
    `ID` INTEGER NOT NULL,
    `NIK` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `token` VARCHAR(100) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
