/*
  Warnings:

  - You are about to drop the column `foot` on the `JobLumberCost` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `JobLumberCost` table. All the data in the column will be lost.
  - You are about to drop the column `replace` on the `JobLumberCost` table. All the data in the column will be lost.
  - Added the required column `cost_over` to the `JobLumberCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `JobLumberCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `JobLumberCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entered_date` to the `JobLumberCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ft_per_peice` to the `JobLumberCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job_number` to the `JobLumberCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `JobLumberCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_cost` to the `JobLumberCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wood_id` to the `JobLumberCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wood_replace_id` to the `JobLumberCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wood_type` to the `JobLumberCost` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobLumberCost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "job_number" INTEGER NOT NULL,
    "wood_id" INTEGER NOT NULL,
    "wood_type" TEXT NOT NULL,
    "wood_replace_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "thickness" REAL NOT NULL,
    "length" REAL NOT NULL,
    "width" REAL NOT NULL,
    "cost_over" INTEGER NOT NULL,
    "total_cost" INTEGER NOT NULL,
    "ft_per_peice" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "tbf" REAL NOT NULL,
    "wood_cost" REAL NOT NULL,
    "entered_by" TEXT NOT NULL,
    "entered_date" TEXT NOT NULL
);
INSERT INTO "new_JobLumberCost" ("entered_by", "id", "length", "quantity", "tbf", "thickness", "width", "wood_cost") SELECT "entered_by", "id", "length", "quantity", "tbf", "thickness", "width", "wood_cost" FROM "JobLumberCost";
DROP TABLE "JobLumberCost";
ALTER TABLE "new_JobLumberCost" RENAME TO "JobLumberCost";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
