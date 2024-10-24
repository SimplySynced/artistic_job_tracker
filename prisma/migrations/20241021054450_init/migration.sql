/*
  Warnings:

  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `name` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `added_by` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nick_name` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pay_rate` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pay_rate_b` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Job";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TimeSheet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employee_id" INTEGER NOT NULL,
    "job_number" INTEGER NOT NULL,
    "job_code" INTEGER NOT NULL,
    "job_hours" INTEGER NOT NULL,
    "job_minutes" INTEGER NOT NULL,
    "pay_rate" REAL NOT NULL,
    "pay_rate_b" REAL NOT NULL,
    "added_by" TEXT NOT NULL,
    "added_date" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Wood" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "thickness" REAL NOT NULL,
    "length" REAL NOT NULL,
    "width" REAL NOT NULL,
    "foot" REAL NOT NULL,
    "tbf" REAL NOT NULL,
    "wood_cost" REAL NOT NULL,
    "replace" REAL NOT NULL,
    "entered_by" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "nick_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "pay_rate" REAL NOT NULL,
    "pay_rate_b" REAL NOT NULL,
    "added_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL
);
INSERT INTO "new_Employee" ("id") SELECT "id" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
