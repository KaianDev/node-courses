import { eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../database/client.ts";
import { coursesTable } from "../database/schema.ts";

export const deleteCourseRoute: FastifyPluginCallbackZod = (server) => {
	server.delete(
		"/courses/:id",
		{
			schema: {
				tags: ["courses"],
				summary: "Delete a course",
				operationId: "delete_course",
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
