const { z } = require("zod");

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  parent_name: z.string().optional(),
  description: z.string().min(5, "Description must be at least 5 characters"),
  created_at: z.string().min(1, "Created At is required"),
});