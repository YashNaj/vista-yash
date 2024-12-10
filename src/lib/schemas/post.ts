import { z } from "zod";

export const CreatePostSchema = z.object({
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

export const UpdatePostSchema = CreatePostSchema.partial();

export const SearchPostSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(50, "Search query must be less than 50 characters"),
});

// Types derived from schemas
export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
export type SearchPostInput = z.infer<typeof SearchPostSchema>;
