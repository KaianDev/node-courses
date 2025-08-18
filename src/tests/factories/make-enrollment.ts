import { fakerPT_BR as faker } from "@faker-js/faker";
import { db } from "../../database/client";
import { enrollmentsTable, usersTable } from "../../database/schema";

export const makeEnrollment = async (courseId: string) => {
	const user = await db
		.insert(usersTable)
		.values({
			email: faker.internet.email(),
			name: faker.person.firstName(),
		})
		.returning();

	const results = await db
		.insert(enrollmentsTable)
		.values({
			courseId,
			userId: user[0].id,
		})
		.returning();

	return results[0];
};
