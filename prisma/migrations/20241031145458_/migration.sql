-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Jobs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "job_code" INTEGER NOT NULL,
    "job_name" TEXT NOT NULL,
    "job_location" TEXT NOT NULL DEFAULT 'Avenel',
    "job_description" TEXT
);
INSERT INTO "new_Jobs" ("id", "job_code", "job_description", "job_location", "job_name") SELECT "id", "job_code", "job_description", "job_location", "job_name" FROM "Jobs";
DROP TABLE "Jobs";
ALTER TABLE "new_Jobs" RENAME TO "Jobs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
