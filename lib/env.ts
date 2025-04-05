import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_BETTERAUTH_BASE_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_BETTERAUTH_BASE_URL is required"),
});

export const env = envSchema.parse(process.env);
