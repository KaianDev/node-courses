import { eq } from "drizzle-orm";
import { db } from "../../database/client";
import { coursesTable } from "../../database/schema";

export const getCourse = async (courseId: string) => {
	const results = await db
		.select()
		.from(coursesTable)
		.where(eq(coursesTable.id, courseId));

	return results[0];
};
