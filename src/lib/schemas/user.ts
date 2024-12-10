import { getUserByEmail } from "$lib/db";
import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required")
    .refine(async (email) => {
      const [user, error] = await getUserByEmail(email);
      return !user;
    }, "Email already exists"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserSchema = typeof createUserSchema;
export type UpdateUserSchema = typeof updateUserSchema;
