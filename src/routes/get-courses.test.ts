import { randomUUID } from "node:crypto";
import request from "supertest";
import { describe, expect, test } from "vitest";
import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";
import { makeEnrollment } from "../tests/factories/make-enrollment.ts";

describe("getCoursesRoute", () => {
	test("should get courses successfully", async () => {
		await server.ready();

		const titleId = randomUUID();
		const course = await makeCourse(titleId);
		await makeEnrollment(course.id);

		const response = await request(server.server).get(
			`/courses?search=${titleId}&limit=10`
		);

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
});
