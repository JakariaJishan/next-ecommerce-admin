import { z } from "zod";
export const allowedActions = ["view", "create", "update", "delete"];
export const permissionTypes = [
  "category",
  "blog",
  "search histories",
  "report",
  "contest",
  "seller info",
  "role",
  "permission",
  "admin",
  "ads",
  "contest entry",
  "contest vote"
];
export const permissionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  permissionType: z.enum(permissionTypes)
    .default("category"),
  action: z.array(z.enum(allowedActions)).optional().default([]),
});
