/*
  Warnings:

  - You are about to drop the column `job_hours` on the `TimeSheets` table. All the data in the column will be lost.
  - You are about to drop the column `job_minutes` on the `TimeSheets` table. All the data in the column will be lost.

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
    "begin_time" TEXT DEFAULT '',
    "end_time" TEXT DEFAULT '',
    "pay_rate" REAL NOT NULL,
    "added_by" TEXT NOT NULL,
    "added_date" TEXT NOT NULL
);
INSERT INTO "new_TimeSheets" ("added_by", "added_date", "begin_time", "date_worked", "employee_id", "end_time", "id", "job_code", "job_number", "pay_rate") SELECT "added_by", "added_date", "begin_time", "date_worked", "employee_id", "end_time", "id", "job_code", "job_number", "pay_rate" FROM "TimeSheets";
DROP TABLE "TimeSheets";
ALTER TABLE "new_TimeSheets" RENAME TO "TimeSheets";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
