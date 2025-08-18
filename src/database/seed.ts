import { fakerPT_BR as faker } from "@faker-js/faker";
import { db } from "./client.ts";
import { coursesTable, enrollmentsTable, usersTable } from "./schema.ts";

export const seed = async () => {
	console.log("Start seed");
	const userResults = await db
		.insert(usersTable)
		.values([
			{ email: faker.internet.email(), name: faker.person.fullName() },
			{ email: faker.internet.email(), name: faker.person.fullName() },
			{ email: faker.internet.email(), name: faker.person.fullName() },
		])
		.returning();
	console.log("Create users");

	const coursesResult = await db
		.insert(coursesTable)
		.values([{ title: faker.lorem.words(4) }, { title: faker.lorem.words(4) }])
		.returning();
	console.log("Create courses");

	await db.insert(enrollmentsTable).values([
		{ userId: userResults[0].id, courseId: coursesResult[0].id },
		{ userId: userResults[1].id, courseId: coursesResult[1].id },
		{ userId: userResults[2].id, courseId: coursesResult[1].id },
	]);
	console.log("Create enrollments");
};

seed();
