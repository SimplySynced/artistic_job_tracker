/*
  Warnings:

  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Employee";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Employees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "nick_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "pay_rate" REAL NOT NULL,
    "pay_rate_b" REAL NOT NULL,
    "total_pay" REAL NOT NULL DEFAULT 0,
    "added_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL
);
