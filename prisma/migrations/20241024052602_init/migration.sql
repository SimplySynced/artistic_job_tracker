/*
  Warnings:

  - The primary key for the `JobLaborCodes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `in` on the `JobLaborCodes` table. All the data in the column will be lost.
  - Added the required column `id` to the `JobLaborCodes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobLaborCodes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL
);
INSERT INTO "new_JobLaborCodes" ("description") SELECT "description" FROM "JobLaborCodes";
DROP TABLE "JobLaborCodes";
ALTER TABLE "new_JobLaborCodes" RENAME TO "JobLaborCodes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
