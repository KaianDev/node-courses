import { fakerPT_BR as faker } from "@faker-js/faker";
import { hash } from "argon2";

import { db } from "../../database/client.ts";
import { enrollmentsTable, usersTable } from "../../database/schema.ts";

export const makeEnrollment = async (
	courseId: string,
	role?: "student" | "manager"
) => {
	const passwordHash = await hash("123456");
	const user = await db
		.insert(usersTable)
		.values({
			email: faker.internet.email(),
			name: faker.person.firstName(),
			password: passwordHash,
			role,
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
