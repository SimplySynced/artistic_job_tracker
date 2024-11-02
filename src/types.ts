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
