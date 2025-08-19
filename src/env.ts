import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.url().startsWith("postgres://"),
	NODE_ENV: z.enum(["development", "test", "production"]),
	JWT_SECRET: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	BASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
