/*
  Warnings:

  - You are about to drop the column `total_pay` on the `Employees` table. All the data in the column will be lost.
  - Added the required column `total_pay` to the `TimeSheet` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employees" (
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
INSERT INTO "new_Employees" ("added_by", "first_name", "id", "last_name", "location", "nick_name", "pay_rate", "pay_rate_b", "updated_by") SELECT "added_by", "first_name", "id", "last_name", "location", "nick_name", "pay_rate", "pay_rate_b", "updated_by" FROM "Employees";
DROP TABLE "Employees";
ALTER TABLE "new_Employees" RENAME TO "Employees";
CREATE TABLE "new_TimeSheet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employee_id" INTEGER NOT NULL,
    "date_worked" TEXT NOT NULL,
    "job_number" INTEGER NOT NULL,
    "job_code" INTEGER NOT NULL,
    "job_hours" INTEGER NOT NULL,
    "job_minutes" INTEGER NOT NULL,
    "pay_rate" REAL NOT NULL,
    "total_pay" REAL NOT NULL,
    "added_by" TEXT NOT NULL,
    "added_date" TEXT NOT NULL
);
INSERT INTO "new_TimeSheet" ("added_by", "added_date", "date_worked", "employee_id", "id", "job_code", "job_hours", "job_minutes", "job_number", "pay_rate") SELECT "added_by", "added_date", "date_worked", "employee_id", "id", "job_code", "job_hours", "job_minutes", "job_number", "pay_rate" FROM "TimeSheet";
DROP TABLE "TimeSheet";
ALTER TABLE "new_TimeSheet" RENAME TO "TimeSheet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
