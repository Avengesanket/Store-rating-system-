import { z } from 'zod';

// 1. Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// 2. Signup Schema (Matches Backend DTO)
export const signupSchema = z.object({
  name: z.string().min(10, 'Name must be at least 10 characters').max(60, 'Name too long'),
  email: z.string().email('Invalid email address'),
  address: z.string().max(400, 'Address too long'),
  password: z.string()
    .min(8, 'Min 8 characters')
    .max(16, 'Max 16 characters')
    .regex(/[A-Z]/, 'Must contain one uppercase letter')
    .regex(/[a-z]/, 'Must contain one lowercase letter')
    .regex(/[0-9]|[^A-Za-z0-9]/, 'Must contain one number or special char'),
});

// 3. Create User (Admin) Schema - adds Role selection
export const createUserSchema = signupSchema.extend({
  role: z.enum(['admin', 'normal_user', 'store_owner']),
});

// 4. Create Store Schema
export const createStoreSchema = z.object({
  name: z.string().min(3).max(60),
  address: z.string().max(400),
  email: z.string().email(),
  ownerId: z.string().uuid('Please select a valid owner'),
}); 