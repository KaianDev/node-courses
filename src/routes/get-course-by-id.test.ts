import request from "supertest";
import { describe, expect, test } from "vitest";
import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";

describe("getCourseByIdRoute", () => {
	test("get course by id", async () => {
		await server.ready();
		const course = await makeCourse();
		const response = await request(server.server).get(`/courses/${course.id}`);

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
});
