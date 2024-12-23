// types.ts
import { z } from 'zod';

// Zod schema for runtime validation
// export const EmployeeSchema = z.object({
//     id: z.number().optional(), // Optional for new employees
//     first_name: z.string().min(1, "First name is required"),
//     last_name: z.string(),
//     nick_name: z.string(),
//     location: z.string(),
//     pay_rate: z.number().nonnegative("Pay rate must be positive"),
//     added_by: z.string(),
//     updated_by: z.string(),
// });

export const EmployeeSchema = z.object({
    id: z.number().optional(), // Optional for new employees
    first_name: z.string().min(1, "First name is required"), // Required
    last_name: z.string().nullable(), // Optional, can be null
    nick_name: z.string().nullable(), // Optional, can be null
    location: z.string().nullable(), // Optional, can be null
    pay_rate: z.number().nonnegative("Pay rate must be positive"), // Required and must be non-negative
    added_by: z.string().nullable(), // Optional, can be null
    updated_by: z.string().nullable(), // Optional, can be null
    active: z.boolean(),
});

// TypeScript types derived from Zod schema
export type Employee = z.infer<typeof EmployeeSchema>;
export type NewEmployee = Omit<Employee, 'id'>;

// Form data type (string values for input fields)
export type EmployeeFormData = {
    first_name: string;
    last_name: string | null;
    nick_name: string | null;
    location: string | null;
    pay_rate: string; // Form fields always handle numbers as strings
    added_by: string | null;
    updated_by: string | null;
    active: boolean
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
    employee_id: number;
    date_worked: string;
    job_number: number;
    job_code: number;
    begin_time: string;
    end_time: string;
    hours: number;
    minutes: number;
    pay_rate: number;
    added_by: string;
    added_date: string;
};

// Updated Zod schema for Jobs
export const JobSchema = z.object({
    id: z.number().optional(),
    job_number: z.number().min(1, 'Job Number is required'),
    job_location: z.string().min(1, 'Job Location is required'),
    job_customer: z.string().min(1, 'Customer name is required'),
    job_address: z.string().min(1, 'Address is required'),
});

// Updated TypeScript types derived from Zod schema
export type Job = z.infer<typeof JobSchema>;
export type NewJobCode = Omit<Job, 'id'>;

// Updated Form data type (string values for input fields)
export type JobFormData = {
    job_number: number;
    job_location: string;
    job_customer: string;
    job_address: string; // Combined address
    street?: string; // Optional field
    city?: string;   // Optional field
    state?: string;  // Optional field
    zip?: string;    // Optional field
};

// Updated Zod schema for JobLumberCost
export const LumberCostSchema = z.object({
    id: z.number().optional(),
    date: z.string().min(1, 'Date is required'),
    job_number: z.number().min(1, 'Job Number is required'),
    wood_id: z.number().min(1, 'Wood ID is required'),
    wood_type: z.string().min(1, 'Wood Type is required'),
    wood_replace_id: z.number().min(1, 'Wood Replacement ID'),
    quantity: z.number().min(1, 'Quantity required'),
    description: z.string().min(1, 'Job Description'),
    thickness: z.number().min(1, 'Thickness is required'),
    length: z.number().min(1, 'Length is required'),
    width: z.number().min(1, 'Width is required'),
    cost_over: z.number(),
    total_cost: z.number(),
    ft_per_piece: z.number(),
    price: z.number(),
    tbf: z.number(),
    entered_by: z.string(),
    entered_date: z.string(),
    updated_by: z.string(),
    updated_date: z.string()
});

// Updated TypeScript types derived from Zod schema
export type LumberCost = z.infer<typeof LumberCostSchema>;
export type NewLumberCost = Omit<LumberCost, 'id'>;

// Updated Form data type (string values for input fields)
export type LumberCostFormData = {
    date: string;
    job_number: number;
    wood_id: number;
    wood_type: string;
    wood_replace_id: number;
    quantity: number;
    description: string;
    thickness: number;
    length: number;
    width: number;
    cost_over: number;
    total_cost: number;
    ft_per_piece: number;
    price: number;
    tbf: number;
    entered_by: string;
    entered_date: string;
    updated_by: string;
    updated_date: string
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

// Zod schema for Wood Replacement
export const WoodReplacementSchema = z.object({
    replace_cost_id: z.number().optional(),
    wood_id: z.number().optional(),
    wood_type: z.string().min(1, "Wood Replacement is required"),
    thickness: z.number().optional(),
    waste_factor: z.number().optional(),
    unit: z.string().min(1, "Wood Replacement is required"),
    replacement: z.number().optional(),
    price: z.number().optional(),
    updated_date: z.number().optional()
});

// TypeScript types derived from Zod schema
export type WoodReplacement = z.infer<typeof WoodReplacementSchema>;
export type NewWoodReplacement = Omit<WoodReplacement, 'id'>;

// Form data type (string values for input fields)
export type WoodReplacementFormData = {
    replace_cost_id: number;
    wood_id: number;
    wood_type: string;
    thickness: number;
    waste_factor: number;
    unit: string;
    replacement: number;
    price: number;
    updated_date: string;
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
