/*
  Warnings:

  - Added the required column `begin_time` to the `TimeSheets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `TimeSheets` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimeSheets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employee_id" INTEGER NOT NULL,
    "date_worked" TEXT NOT NULL,
    "job_number" INTEGER NOT NULL,
    "job_code" INTEGER NOT NULL,
    "job_hours" INTEGER NOT NULL,
    "job_minutes" INTEGER NOT NULL,
    "begin_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "pay_rate" REAL NOT NULL,
    "total_pay" REAL NOT NULL,
    "added_by" TEXT NOT NULL,
    "added_date" TEXT NOT NULL
);
INSERT INTO "new_TimeSheets" ("added_by", "added_date", "date_worked", "employee_id", "id", "job_code", "job_hours", "job_minutes", "job_number", "pay_rate", "total_pay") SELECT "added_by", "added_date", "date_worked", "employee_id", "id", "job_code", "job_hours", "job_minutes", "job_number", "pay_rate", "total_pay" FROM "TimeSheets";
DROP TABLE "TimeSheets";
ALTER TABLE "new_TimeSheets" RENAME TO "TimeSheets";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
