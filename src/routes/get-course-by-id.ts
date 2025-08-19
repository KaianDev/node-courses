import { eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../database/client.ts";
import { coursesTable } from "../database/schema.ts";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";

export const getCourseByIdRoute: FastifyPluginCallbackZod = (server) => {
	server.get(
		"/courses/:id",
		{
			preHandler: [checkRequestJWT],
			schema: {
				tags: ["courses"],
				summary: "Get course by course id",
				operationId: "get_course_by_id",
				params: z.object({
					id: z.uuid(),
				}),
				response: {
					200: z
						.object({
							course: z.object({
								id: z.string(),
								title: z.string(),
								description: z.string().nullable(),
								createdAt: z.date(),
							}),
						})
						.describe("Course is found"),
					404: z.null().describe("Course not found"),
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as { id: string };

			const results = await db
				.select()
				.from(coursesTable)
				.where(eq(coursesTable.id, id));

			if (results.length > 0) {
				return { course: results[0] };
			}

			return reply.status(404).send();
		}
	);
};
