import { db } from "../../database/client.ts";
import { enrollmentsTable } from "../../database/schema.ts";

export const makeEnrollment = async (courseId: string, userId: string) => {
	const results = await db
		.insert(enrollmentsTable)
		.values({
			courseId,
			userId,
		})
		.returning();

	return results[0];
};
