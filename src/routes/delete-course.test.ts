import request from "supertest";
import { describe, expect, test } from "vitest";
import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";

describe("deleteCourseRoute", () => {
	test("delete a course", async () => {
		await server.ready();
		const course = await makeCourse();
		const response = await request(server.server).delete(
			`/courses/${course.id}`
		);

		expect(response.status).toEqual(204);
	});
});
