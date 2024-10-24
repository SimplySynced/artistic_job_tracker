/*
  Warnings:

  - Added the required column `date_worked` to the `TimeSheet` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimeSheet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employee_id" INTEGER NOT NULL,
    "date_worked" TEXT NOT NULL,
    "job_number" INTEGER NOT NULL,
    "job_code" INTEGER NOT NULL,
    "job_hours" INTEGER NOT NULL,
    "job_minutes" INTEGER NOT NULL,
    "pay_rate" REAL NOT NULL,
    "added_by" TEXT NOT NULL,
    "added_date" TEXT NOT NULL
);
INSERT INTO "new_TimeSheet" ("added_by", "added_date", "employee_id", "id", "job_code", "job_hours", "job_minutes", "job_number", "pay_rate") SELECT "added_by", "added_date", "employee_id", "id", "job_code", "job_hours", "job_minutes", "job_number", "pay_rate" FROM "TimeSheet";
DROP TABLE "TimeSheet";
ALTER TABLE "new_TimeSheet" RENAME TO "TimeSheet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
