/*
  Warnings:

  - You are about to drop the column `job_description` on the `Jobs` table. All the data in the column will be lost.
  - You are about to drop the column `job_name` on the `Jobs` table. All the data in the column will be lost.
  - Added the required column `job_customer` to the `Jobs` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Jobs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "job_code" INTEGER NOT NULL,
    "job_location" TEXT NOT NULL DEFAULT 'Avenel',
    "job_customer" TEXT NOT NULL,
    "job_address" TEXT
);
INSERT INTO "new_Jobs" ("id", "job_code", "job_location") SELECT "id", "job_code", "job_location" FROM "Jobs";
DROP TABLE "Jobs";
ALTER TABLE "new_Jobs" RENAME TO "Jobs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
