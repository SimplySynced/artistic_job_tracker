-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
