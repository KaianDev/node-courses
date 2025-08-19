import { faker } from "@faker-js/faker";
import request from "supertest";
import { describe, expect, test } from "vitest";

import { server } from "../app.ts";
import { getCourse } from "../tests/factories/get-course.ts";
import { makeCourse } from "../tests/factories/make-course.ts";
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts";

describe("updateCourseRoute", () => {
	test("should update a course successfully", async () => {
		await server.ready();

		const course = await makeCourse();
		const { token } = await makeAuthenticatedUser("manager");

		const newTitle = faker.lorem.words(4);
		const newDescription = faker.lorem.words(10);

		const response = await request(server.server)
			.patch(`/courses/${course.id}`)
			.set("Content-Type", "application/json")
			.set("Authorization", token)
			.send({
				title: newTitle,
				description: newDescription,
			});

		const courseAfterUpdate = await getCourse(course.id);

		expect(response.status).toEqual(204);
		expect(courseAfterUpdate.title).toEqual(newTitle);
		expect(courseAfterUpdate.description).toEqual(newDescription);
	});

	test("should return 404 for non existing courses", async () => {
		await server.ready();
		const response = await request(server.server)
			.patch("/courses/4eabdc5b-084f-4956-9e1d-8d47eb522cd7")
			.set("Content-Type", "application/json")
			.send({
				title: faker.lorem.words(4),
				description: faker.lorem.words(6),
			});

		expect(response.status).toEqual(404);
	});
});
