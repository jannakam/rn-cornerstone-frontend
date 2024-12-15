import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().regex(/^\d{8}$/, "Phone number must be 8 digits"),
});

export const registerSchema = loginSchema.extend({
  age: z
    .number()
    .int()
    .min(13, "You must be at least 13 years old")
    .max(120, "Age must be less than 120"),
  weight: z.number().positive("Weight must be a positive number"),
  height: z.number().positive("Height must be a positive number"),
  city: z.string().min(2, "City name must be at least 2 characters"),
});
