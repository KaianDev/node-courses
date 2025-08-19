import { eq } from "drizzle-orm";
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
				security: [{ bearerAuth: [] }],
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
					409: z
						.object({
							error: z.string(),
						})
						.describe("Já existe curso com esse título"),
				},
			},
		},
		async (request, reply) => {
			const { title, description } = request.body;

			const courses = await db
				.select({ id: coursesTable.id })
				.from(coursesTable)
				.where(eq(coursesTable.title, title));

			if (courses.length > 0) {
				return reply
					.status(409)
					.send({ error: "The course title is already exist" });
			}

			const result = await db
				.insert(coursesTable)
				.values({ title, description })
				.returning();

			return reply.status(201).send({ courseId: result[0].id });
		}
	);
};
