import request from "supertest";
import { describe, expect, test } from "vitest";

import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts";

describe("getCourseByIdRoute", () => {
	test("get course by id", async () => {
		await server.ready();

		const { token } = await makeAuthenticatedUser("student");
		const course = await makeCourse();
		const response = await request(server.server)
			.get(`/courses/${course.id}`)
			.set("Authorization", token);

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			course: {
				id: expect.any(String),
				title: expect.any(String),
				description: null,
				createdAt: expect.any(String),
			},
		});
	});

	test("should return 404 for non existing courses", async () => {
		await server.ready();

		const { token } = await makeAuthenticatedUser("student");
		const response = await request(server.server)
			.get("/courses/4eabdc5b-084f-4956-9e1d-8d47eb522cd7")
			.set("Authorization", token);

		expect(response.status).toEqual(404);
	});
});
