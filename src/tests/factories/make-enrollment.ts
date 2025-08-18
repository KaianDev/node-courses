import { db } from "../../database/client.ts";
import { enrollmentsTable } from "../../database/schema.ts";
import { makeUser } from "./make-user.ts";

export const makeEnrollment = async (
	courseId: string,
	role?: "student" | "manager"
) => {
	const { user } = await makeUser(role);

	const results = await db
		.insert(enrollmentsTable)
		.values({
			courseId,
			userId: user.id,
		})
		.returning();

	return results[0];
};
