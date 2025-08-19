import { randomUUID } from "node:crypto";
import request from "supertest";
import { describe, expect, test } from "vitest";

import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";
import { makeEnrollment } from "../tests/factories/make-enrollment.ts";
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts";

describe("createEnrollment", () => {
	test("should create a enrollment successfully", async () => {
		await server.ready();
		const { id } = await makeCourse();
		const { token } = await makeAuthenticatedUser("student");

		const response = await request(server.server)
			.post("/enrollments")
			.set("Content-Type", "application/json")
			.set("Authorization", `Bearer ${token}`)
			.send({
				courseId: id,
			});

		expect(response.status).toEqual(201);
		expect(response.body).toEqual({
			enrollmentId: expect.any(String),
		});
	});

	test("should return 404 for non existing courses", async () => {
		await server.ready();
		const { token } = await makeAuthenticatedUser("student");

		const response = await request(server.server)
			.post("/enrollments")
			.set("Content-Type", "application/json")
			.set("Authorization", `Bearer ${token}`)
			.send({
				courseId: randomUUID(),
			});

		expect(response.status).toEqual(404);
	});

	test("should return 409 when user is already enrolled", async () => {
		await server.ready();
		const { token, user } = await makeAuthenticatedUser("student");
		const course = await makeCourse();
		await makeEnrollment(course.id, user.id);

		const response = await request(server.server)
			.post("/enrollments")
			.set("Content-Type", "application/json")
			.set("Authorization", `Bearer ${token}`)
			.send({
				courseId: course.id,
			});

		expect(response.status).toEqual(409);
		expect(response.body).toEqual({
			error: expect.any(String),
		});
	});
});
