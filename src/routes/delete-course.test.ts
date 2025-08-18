import request from "supertest";
import { describe, expect, test } from "vitest";
import { server } from "../app.ts";
import { getCourse } from "../tests/factories/get-course.ts";
import { makeCourse } from "../tests/factories/make-course.ts";

describe("deleteCourseRoute", () => {
	test("should delete a course successfully", async () => {
		await server.ready();
		const course = await makeCourse();
		const response = await request(server.server).delete(
			`/courses/${course.id}`
		);

		const courseAfterDeletion = await getCourse(course.id);

		expect(response.status).toEqual(204);
		expect(courseAfterDeletion).toBeUndefined();
	});
});
