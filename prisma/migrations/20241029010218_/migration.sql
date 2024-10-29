/*
  Warnings:

  - You are about to alter the column `job_code` on the `JobLaborCodes` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobLaborCodes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "job_code" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_JobLaborCodes" ("description", "id", "job_code") SELECT "description", "id", "job_code" FROM "JobLaborCodes";
DROP TABLE "JobLaborCodes";
ALTER TABLE "new_JobLaborCodes" RENAME TO "JobLaborCodes";
CREATE TABLE "new_WoodTypes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wood_type" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_WoodTypes" ("id", "wood_type") SELECT "id", "wood_type" FROM "WoodTypes";
DROP TABLE "WoodTypes";
ALTER TABLE "new_WoodTypes" RENAME TO "WoodTypes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
