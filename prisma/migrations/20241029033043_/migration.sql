-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "nick_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "pay_rate" REAL NOT NULL,
    "pay_rate_b" REAL NOT NULL,
    "total_pay" REAL NOT NULL DEFAULT 0,
    "added_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL
);
INSERT INTO "new_Employee" ("added_by", "first_name", "id", "last_name", "location", "nick_name", "pay_rate", "pay_rate_b", "updated_by") SELECT "added_by", "first_name", "id", "last_name", "location", "nick_name", "pay_rate", "pay_rate_b", "updated_by" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
