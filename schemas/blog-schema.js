import { z } from "zod";
export const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  published_date: z.string().min(1, "Published Date is required"),
  created_at: z.string().min(1, "Created At is required"),
});