-- CreateTable
CREATE TABLE "Locations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true
);
