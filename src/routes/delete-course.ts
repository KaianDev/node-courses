import { eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../database/client.ts";
import { coursesTable } from "../database/schema.ts";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";

export const deleteCourseRoute: FastifyPluginCallbackZod = (server) => {
	server.delete(
		"/courses/:id",
		{
			preHandler: [checkRequestJWT, checkUserRole("manager")],
			schema: {
				tags: ["courses"],
				summary: "Delete a course",
				operationId: "delete_course",
				security: [{ bearerAuth: [] }],
				params: z.object({
					id: z.uuid(),
				}),
				response: {
					204: z.null().describe("Course successfully deleted"),
					404: z.null().describe("Course not found"),
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params;

			const condition = eq(coursesTable.id, id);

			const results = await db
				.select({ id: coursesTable.id })
				.from(coursesTable)
				.where(condition);

			if (results.length === 0) {
				return reply.status(404).send();
			}

			await db.delete(coursesTable).where(condition);

			return reply.status(204).send();
		}
	);
};
