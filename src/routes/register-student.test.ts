import { fakerPT_BR as faker } from "@faker-js/faker";
import request from "supertest";
import { describe, expect, test } from "vitest";
import { server } from "../app.ts";

describe("registerStudentRoute", () => {
	test("Should register a student successfully", async () => {
		await server.ready();

		const response = await request(server.server)
			.post("/students")
			.set("Content-Type", "application/json")
			.send({
				name: faker.person.firstName(),
				email: faker.internet.email(),
				password: "123456",
			});

		expect(response.status).toEqual(201);
		expect(response.body).toEqual({
			studentId: expect.any(String),
		});
	});
});
