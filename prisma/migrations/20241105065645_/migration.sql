/*
  Warnings:

  - You are about to drop the `TimeSheet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TimeSheet";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TimeSheets" (
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
