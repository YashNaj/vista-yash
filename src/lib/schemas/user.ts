import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Types derived from schemas
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
