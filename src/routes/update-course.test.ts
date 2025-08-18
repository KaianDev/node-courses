import { faker } from "@faker-js/faker";
import request from "supertest";
import { describe, expect, test } from "vitest";
import { server } from "../app.ts";
import { getCourse } from "../tests/factories/get-course.ts";
import { makeCourse } from "../tests/factories/make-course.ts";

describe("updateCourseRoute", () => {
	test("should update a course successfully", async () => {
		await server.ready();

		const course = await makeCourse();

		const newTitle = faker.lorem.words(4);
		const newDescription = faker.lorem.words(10);

		const response = await request(server.server)
			.patch(`/courses/${course.id}`)
			.set("Content-Type", "application/json")
			.send({
				title: newTitle,
				description: newDescription,
			});

		const courseAfterUpdate = await getCourse(course.id);

		expect(response.status).toEqual(204);
		expect(courseAfterUpdate.title).toEqual(newTitle);
		expect(courseAfterUpdate.description).toEqual(newDescription);
	});
});
