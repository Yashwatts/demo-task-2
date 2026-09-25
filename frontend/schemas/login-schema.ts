import { z } from "zod";

export const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, "Username or email is required")
    .max(50, "Username or email must be less than 50 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(255, "Password must be less than 255 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
