import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../database/client.ts";
import { coursesTable } from "../database/schema.ts";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";

export const createCourseRoute: FastifyPluginCallbackZod = (server) => {
	server.post(
		"/courses",
		{
			preHandler: [checkRequestJWT, checkUserRole("manager")],
			schema: {
				tags: ["courses"],
				summary: "Create a course",
				operationId: "create_course",
				body: z.object({
					title: z.string().min(1),
					description: z.string().optional(),
				}),
				response: {
					201: z
						.object({
							courseId: z.uuid(),
						})
						.describe("Curso criado com sucesso"),
				},
			},
		},
		async (request, reply) => {
			const { title, description } = request.body;

			const result = await db
				.insert(coursesTable)
				.values({ title, description })
				.returning();

			return reply.status(201).send({ courseId: result[0].id });
		}
	);
};
