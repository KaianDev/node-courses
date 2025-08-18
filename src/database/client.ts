import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../env.ts";

const pool = new Pool({
	connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
	logger: env.NODE_ENV === "development",
});

export const closeDb = async () => {
	await pool.end();
};
