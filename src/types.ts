// types.ts
import { z } from 'zod';

// Zod schema for runtime validation
export const EmployeeSchema = z.object({
    id: z.number().optional(), // Optional for new employees
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    nick_name: z.string().min(1, "Nick name is required"),
    location: z.string().min(1, "Location is required"),
    pay_rate: z.number().positive("Pay rate must be positive"),
    pay_rate_b: z.number().optional(),
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
    pay_rate_b: string;
    added_by: string;
    updated_by: string;
};