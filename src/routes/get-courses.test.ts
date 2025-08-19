import { randomUUID } from "node:crypto";
import request from "supertest";
import { describe, expect, test } from "vitest";

import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";
import { makeEnrollment } from "../tests/factories/make-enrollment.ts";
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts";

describe("getCoursesRoute", () => {
	test("should get courses successfully with 'search' query params", async () => {
		await server.ready();

		const { token, user } = await makeAuthenticatedUser("student");
		const titleId = randomUUID();
		const course = await makeCourse(titleId);
		await makeEnrollment(course.id, user.id);

		const response = await request(server.server)
			.get(`/courses?search=${titleId}&limit=10`)
			.set("Authorization", token);

		expect(response.status).toEqual(200);

		expect(response.body).toEqual({
			courses: [{ id: expect.any(String), title: titleId, enrollments: 1 }],
			metadata: {
				total: 1,
				pages: 1,
				currentPage: 1,
				limit: 10,
			},
		});
	});

	test("should get courses successfully with 'sort' query params", async () => {
		await server.ready();

		const timestamp = Date.now();
		const { token } = await makeAuthenticatedUser("student");

		const [courseC, courseB, courseA] = await Promise.all([
			makeCourse(`Curso-test-C-${timestamp}`),
			makeCourse(`Curso-test-B-${timestamp}`),
			makeCourse(`Curso-test-A-${timestamp}`),
		]);

		const response = await request(server.server)
			.get(`/courses?search=${timestamp}&limit=3&sort=title`)
			.set("Authorization", token);

		expect(response.status).toEqual(200);
		expect(response.body.courses[0].title).toEqual(courseA.title);
		expect(response.body.courses[1].title).toEqual(courseB.title);
		expect(response.body.courses[2].title).toEqual(courseC.title);
	});
});
