import { eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../database/client.ts";
import { coursesTable } from "../database/schema.ts";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";

export const updateCourseRoute: FastifyPluginCallbackZod = (server) => {
	server.patch(
		"/courses/:id",
		{
			schema: {
				tags: ["courses"],
				preHandler: [checkRequestJWT, checkUserRole("manager")],
				summary: "Update a course",
				operationId: "update_course",
				params: z.object({
					id: z.uuid(),
				}),
				body: z.object({
					title: z.string().optional(),
					description: z.string().optional(),
				}),
				response: {
					204: z.null().describe("Course successfully updated"),
					404: z.null().describe("Course not found"),
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params;
			const { title, description } = request.body;

			const results = await db
				.update(coursesTable)
				.set({
					title,
					description,
				})
				.where(eq(coursesTable.id, id))
				.returning();

			if (results.length === 0) {
				return reply.status(404).send();
			}

			return reply.status(204).send();
		}
	);
};
