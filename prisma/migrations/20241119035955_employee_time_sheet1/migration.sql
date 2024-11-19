-- CreateTable
CREATE TABLE "Employees" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "nick_name" TEXT,
    "location" TEXT,
    "pay_rate" DOUBLE PRECISION,
    "added_by" TEXT,
    "updated_by" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSheets" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "date_worked" TEXT NOT NULL,
    "job_number" INTEGER NOT NULL,
    "job_code" INTEGER NOT NULL,
    "begin_time" TEXT DEFAULT '',
    "end_time" TEXT DEFAULT '',
    "hours" INTEGER NOT NULL DEFAULT 0,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "pay_rate" DOUBLE PRECISION NOT NULL,
    "added_by" TEXT NOT NULL,
    "added_date" TEXT NOT NULL,

    CONSTRAINT "TimeSheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jobs" (
    "id" SERIAL NOT NULL,
    "job_number" INTEGER NOT NULL,
    "job_location" TEXT NOT NULL,
    "job_customer" TEXT NOT NULL,
    "job_address" TEXT,

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobLumberCost" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "job_number" INTEGER NOT NULL,
    "wood_id" INTEGER NOT NULL,
    "wood_type" TEXT NOT NULL,
    "wood_replace_id" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "thickness" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "cost_over" DOUBLE PRECISION NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,
    "ft_per_piece" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "tbf" DOUBLE PRECISION NOT NULL,
    "entered_by" TEXT NOT NULL,
    "entered_date" TEXT NOT NULL,
    "updated_by" TEXT,
    "updated_date" TEXT,

    CONSTRAINT "JobLumberCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobLaborCodes" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "JobLaborCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locations" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WoodTypes" (
    "id" SERIAL NOT NULL,
    "wood_type" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WoodTypes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Jobs_job_number_key" ON "Jobs"("job_number");

-- CreateIndex
CREATE UNIQUE INDEX "Locations_location_key" ON "Locations"("location");

-- CreateIndex
CREATE UNIQUE INDEX "WoodTypes_wood_type_key" ON "WoodTypes"("wood_type");

-- CreateIndex
CREATE UNIQUE INDEX "WoodTypes_id_wood_type_key" ON "WoodTypes"("id", "wood_type");

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_location_fkey" FOREIGN KEY ("location") REFERENCES "Locations"("location") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSheets" ADD CONSTRAINT "TimeSheets_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSheets" ADD CONSTRAINT "TimeSheets_job_code_fkey" FOREIGN KEY ("job_code") REFERENCES "JobLaborCodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSheets" ADD CONSTRAINT "TimeSheets_job_number_fkey" FOREIGN KEY ("job_number") REFERENCES "Jobs"("job_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_job_location_fkey" FOREIGN KEY ("job_location") REFERENCES "Locations"("location") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobLumberCost" ADD CONSTRAINT "JobLumberCost_wood_id_wood_type_fkey" FOREIGN KEY ("wood_id", "wood_type") REFERENCES "WoodTypes"("id", "wood_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobLumberCost" ADD CONSTRAINT "JobLumberCost_job_number_fkey" FOREIGN KEY ("job_number") REFERENCES "Jobs"("job_number") ON DELETE RESTRICT ON UPDATE CASCADE;
