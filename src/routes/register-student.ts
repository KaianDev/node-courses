import { hash } from "argon2";
import { eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";

import { db } from "../database/client.ts";
import { usersTable } from "../database/schema.ts";
import { createJWTToken } from "../utils/create-jwt-token.ts";

export const registerStudentRoute: FastifyPluginCallbackZod = (server) => {
	server.post(
		"/students",
		{
			schema: {
				tags: ["student"],
				summary: "Register a student",
				operationId: "register a student",
				body: z.object({
					email: z.email(),
					password: z.string().min(6),
					name: z.string().min(1),
				}),
				response: {
					201: z
						.object({
							studentId: z.uuid(),
							token: z.string(),
						})
						.describe("Estudante registrado com sucesso"),
					409: z
						.object({
							error: z.string(),
						})
						.describe("E-mail de estudante já cadastrado"),
				},
			},
		},
		async (request, reply) => {
			const { email, name, password } = request.body;

			const userResult = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, email));

			if (userResult.length > 0) {
				return reply.status(409).send({ error: "E-mail already used" });
			}

			const passwordHash = await hash(password);

			const result = await db
				.insert(usersTable)
				.values({ email, name, password: passwordHash, role: "student" })
				.returning();

			const user = result[0];

			const token = createJWTToken(user);

			return reply.status(201).send({ studentId: user.id, token });
		}
	);
};
