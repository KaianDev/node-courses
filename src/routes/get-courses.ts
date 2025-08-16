import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../database/client.ts";
import { coursesTable } from "../database/schema.ts";

export const getCoursesRoute: FastifyPluginCallbackZod = (server) => {
	server.get(
		"/courses",
		{
			schema: {
				tags: ["courses"],
				summary: "List courses",
				operationId: "get_courses",
				response: {
					200: z.object({
						courses: z.array(
							z.object({
								id: z.uuid(),
								title: z.string(),
							})
						),
					}),
				},
			},
		},
		async () => {
			const results = await db
				.select({
					id: coursesTable.id,
					title: coursesTable.title,
				})
				.from(coursesTable);

			return { courses: results };
		}
	);
};
