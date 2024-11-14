// types.ts
import { z } from 'zod';

// Zod schema for runtime validation
export const EmployeeSchema = z.object({
    id: z.number().optional(), // Optional for new employees
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string(),
    nick_name: z.string(),
    location: z.string(),
    pay_rate: z.number().nonnegative("Pay rate must be positive"),
    added_by: z.string(),
    updated_by: z.string(),
});

// TypeScript types derived from Zod schema
export type Employee = z.infer<typeof EmployeeSchema>;
export type NewEmployee = Omit<Employee, 'id'>;

// Form data type (string values for input fields)
export type EmployeeFormData = {
    first_name: string;
    last_name: string;
    nick_name: string;
    location: string;
    pay_rate: string;
    added_by: string;
    updated_by: string;
};

// Zod schema for runtime validation
export const TimeSheetSchema = z.object({
    id: z.number().optional(),
    employee_id: z.number(),
    date_worked: z.string(),
    job_number: z.number(),
    job_code: z.number(),
    begin_time: z.string(),
    end_time: z.string(),
    hours: z.number(),
    minutes: z.number(),
    pay_rate: z.number().nonnegative(),
    added_by: z.string(),
    added_date: z.string(),
});

// TypeScript types derived from Zod schema
export type TimeSheet = z.infer<typeof TimeSheetSchema>;
export type NewTimeSheet = Omit<TimeSheet, 'id'>;

// Form data type (string values for input fields)
export type TimeSheetFormData = {
    employee_id: string;
    date_worked: string;
    job_number: string;
    job_code: string;
    begin_time: string;
    end_time: string;
    hours: string;
    minutes: string;
    pay_rate: string;
    added_by: string;
    added_date: string;
};

// Zod schema for Jobs
export const JobSchema = z.object({
    id: z.number().optional(),
    job_code: z.number().min(1, "Job Code is required"),
    job_number: z.number().min(1, "Job Number is required"),
    job_location: z.string().min(1, "Job Location is required"),
    job_customer: z.string().min(1, "Customer name required"),
    job_address: z.string(),
});

// TypeScript types derived from Zod schema
export type Job = z.infer<typeof JobSchema>;
export type NewJobCode = Omit<Job, 'id'>;

// Form data type (string values for input fields)
export type JobFormData = {
    job_code: string,
    job_number: string,
    job_location: string,
    job_customer: string,
    job_address: string,
};


// Zod schema for Locations
export const LocationSchema = z.object({
    id: z.number().optional(),
    location: z.string().min(1, "Location name is required"),
});

// TypeScript types derived from Zod schema
export type Location = z.infer<typeof LocationSchema>;
export type NewLocation = Omit<Location, 'id'>;

// Form data type (string values for input fields)
export type LocationFormData = {
    location: string;
};


// Zod schema for Woods
export const WoodSchema = z.object({
    id: z.number().optional(),
    wood_type: z.string().min(1, "Location name is required"),
});

// TypeScript types derived from Zod schema
export type Wood = z.infer<typeof WoodSchema>;
export type NewWood = Omit<Wood, 'id'>;

// Form data type (string values for input fields)
export type WoodFormData = {
    wood_type: string;
};


// Zod schema for Labor Codes
export const LaborCodeSchema = z.object({
    id: z.number().optional(),
    description: z.string().min(1, "Description is required"),
});

// TypeScript types derived from Zod schema
export type LaborCode = z.infer<typeof LaborCodeSchema>;
export type NewLaborCode = Omit<LaborCode, 'id'>;

// Form data type (string values for input fields)
export type LaborCodeFormData = {
    description: string;
};
