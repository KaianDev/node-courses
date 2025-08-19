import request from "supertest";
import { describe, expect, test } from "vitest";

import { server } from "../app.ts";
import { getCourse } from "../tests/factories/get-course.ts";
import { makeCourse } from "../tests/factories/make-course.ts";
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts";

describe("deleteCourseRoute", () => {
	test("should delete a course successfully", async () => {
		await server.ready();

		const { token } = await makeAuthenticatedUser("manager");
		const course = await makeCourse();
		const response = await request(server.server)
			.delete(`/courses/${course.id}`)
			.set("Authorization", token);

		const courseAfterDeletion = await getCourse(course.id);

		expect(response.status).toEqual(204);
		expect(courseAfterDeletion).toBeUndefined();
	});

	test("should return 404 for non existing courses", async () => {
		await server.ready();
		const response = await request(server.server).delete(
			"/courses/4eabdc5b-084f-4956-9e1d-8d47eb522cd7"
		);

		expect(response.status).toEqual(404);
	});
});
