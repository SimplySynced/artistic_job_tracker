/*
  Warnings:

  - You are about to drop the column `pay_rate_b` on the `Employees` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "nick_name" TEXT,
    "location" TEXT,
    "pay_rate" REAL,
    "added_by" TEXT,
    "updated_by" TEXT
);
INSERT INTO "new_Employees" ("added_by", "first_name", "id", "last_name", "location", "nick_name", "pay_rate", "updated_by") SELECT "added_by", "first_name", "id", "last_name", "location", "nick_name", "pay_rate", "updated_by" FROM "Employees";
DROP TABLE "Employees";
ALTER TABLE "new_Employees" RENAME TO "Employees";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
