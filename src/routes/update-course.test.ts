import { faker } from "@faker-js/faker";
import request from "supertest";
import { describe, expect, test } from "vitest";
import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";

describe("updateCourseRoute", () => {
	test("update a course", async () => {
		await server.ready();
		const course = await makeCourse();
		const response = await request(server.server)
			.patch(`/courses/${course.id}`)
			.set("Content-Type", "application/json")
			.send({
				title: faker.lorem.words(4),
				description: faker.lorem.words(10),
			});

		expect(response.status).toEqual(204);
	});
});
