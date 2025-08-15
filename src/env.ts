import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.url().startsWith("postgres://"),
	NODE_ENV: z.enum(["development", "test", "production"]),
});

export const env = envSchema.parse(process.env);
