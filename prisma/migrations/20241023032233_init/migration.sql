/*
  Warnings:

  - You are about to drop the `Wood` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Wood";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Jobs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "job_description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "JobLumberCost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "thickness" REAL NOT NULL,
    "length" REAL NOT NULL,
    "width" REAL NOT NULL,
    "foot" REAL NOT NULL,
    "tbf" REAL NOT NULL,
    "wood_cost" REAL NOT NULL,
    "replace" REAL NOT NULL,
    "entered_by" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "JobLaborCodes" (
    "in" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL
);
