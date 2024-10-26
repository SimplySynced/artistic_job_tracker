/*
  Warnings:

  - Added the required column `job_code` to the `JobLaborCodes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobLaborCodes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "job_code" TEXT NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_JobLaborCodes" ("description", "id") SELECT "description", "id" FROM "JobLaborCodes";
DROP TABLE "JobLaborCodes";
ALTER TABLE "new_JobLaborCodes" RENAME TO "JobLaborCodes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
