/*
  Warnings:

  - You are about to drop the column `wood_cost` on the `JobLumberCost` table. All the data in the column will be lost.

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
    "entered_by" TEXT NOT NULL,
    "entered_date" TEXT NOT NULL
);
INSERT INTO "new_JobLumberCost" ("cost_over", "date", "description", "entered_by", "entered_date", "ft_per_peice", "id", "job_number", "length", "price", "quantity", "tbf", "thickness", "total_cost", "width", "wood_id", "wood_replace_id", "wood_type") SELECT "cost_over", "date", "description", "entered_by", "entered_date", "ft_per_peice", "id", "job_number", "length", "price", "quantity", "tbf", "thickness", "total_cost", "width", "wood_id", "wood_replace_id", "wood_type" FROM "JobLumberCost";
DROP TABLE "JobLumberCost";
ALTER TABLE "new_JobLumberCost" RENAME TO "JobLumberCost";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
