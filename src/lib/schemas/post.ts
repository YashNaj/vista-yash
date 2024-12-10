import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content must be less than 10000 characters"),
  published: z.boolean().default(false),
  authorId: z.number().int().positive().optional(),
});

export const updatePostSchema = createPostSchema.partial();

export const searchPostSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(50, "Search query must be less than 50 characters"),
});

export type CreatePostSchema = typeof createPostSchema;
export type UpdatePostSchema = typeof updatePostSchema;
export type SearchPostSchema = typeof searchPostSchema;
