import { verify } from "argon2";
import { eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import jwt from "jsonwebtoken";
import z from "zod";

import { db } from "../database/client.ts";
import { usersTable } from "../database/schema.ts";
import { env } from "../env.ts";

export const loginRoute: FastifyPluginCallbackZod = (server) => {
	server.post(
		"/sessions",
		{
			schema: {
				tags: ["auth"],
				summary: "Login",
				operationId: "login",
				body: z.object({
					email: z.email(),
					password: z.string().min(6),
				}),
				response: {
					200: z
						.object({
							token: z.string(),
						})
						.describe("Login realizado com sucesso"),
					400: z
						.object({
							error: z.string(),
						})
						.describe("Falha ao realizar login"),
				},
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;

			const result = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, email));

			if (result.length === 0) {
				return reply.status(400).send({ error: "Invalid credentials" });
			}

			const user = result[0];

			const doesPasswordsMatch = await verify(user.password, password);

			if (!doesPasswordsMatch) {
				return reply.status(400).send({ error: "Invalid credentials" });
			}

			const token = jwt.sign(
				{
					sub: user.id,
					role: user.role,
				},
				env.JWT_SECRET
			);

			return reply.status(200).send({ token });
		}
	);
};
