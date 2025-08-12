import z from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .lowercase()
    .min(4, { error: "Username must have at least 4 characters" })
    .regex(/^[a-zA-Z]+$/, { error: "Only alphabetic characters are allowed" }),
  email: z.email().lowercase(),
  password: z
    .string()
    .min(8, { error: "Password must have at least 8 characters" }),
});

export const loginSchema = z.object({
  email: z.email().trim().lowercase(),
  password: z.string(),
});
