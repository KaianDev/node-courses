import { randomUUID } from "node:crypto";
import request from "supertest";
import { describe, expect, test } from "vitest";
import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";
import { makeEnrollment } from "../tests/factories/make-enrollment.ts";
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts";

describe("getEnrollmentsRoute", () => {
	test("should get enrollments successfully", async () => {
		await server.ready();

		const titleId = randomUUID();

		const course1 = await makeCourse(`Curso-Z-${titleId}`);
		const course2 = await makeCourse(`Curso-W-${titleId}`);

		const { token, user } = await makeAuthenticatedUser("manager");

		await Promise.all([
			makeEnrollment(course1.id, user.id),
			makeEnrollment(course2.id, user.id),
		]);

		const response = await request(server.server)
			.get("/enrollments?limit=2")
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			enrollments: expect.arrayContaining([
				{
					id: expect.any(String),
					createdAt: expect.any(String),
					course: {
						id: expect.any(String),
						title: expect.any(String),
					},
					user: {
						id: expect.any(String),
						name: expect.any(String),
						role: expect.any(String),
					},
				},
			]),
			metadata: {
				currentPage: 1,
				limit: 2,
				pages: expect.any(Number),
				total: expect.any(Number),
			},
		});
		expect(response.body.enrollments).toHaveLength(2);
	});
});
