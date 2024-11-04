/*
  Warnings:

  - You are about to drop the column `job_code` on the `JobLaborCodes` table. All the data in the column will be lost.
  - Added the required column `job_labor_code` to the `JobLaborCodes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobLaborCodes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "job_labor_code" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_JobLaborCodes" ("description", "enabled", "id") SELECT "description", "enabled", "id" FROM "JobLaborCodes";
DROP TABLE "JobLaborCodes";
ALTER TABLE "new_JobLaborCodes" RENAME TO "JobLaborCodes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
