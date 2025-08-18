import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { coursesTable } from "../../database/schema.ts";

export const makeCourse = async (title?: string) => {
	const results = await db
		.insert(coursesTable)
		.values({
			title: title ?? faker.lorem.words(4),
		})
		.returning();
	return results[0];
};
