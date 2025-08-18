import { asc, ilike, or } from "drizzle-orm";
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
				querystring: z.object({
					search: z.string().optional(),
					sort: z.enum(["title", "createdAt"]).optional().default("createdAt"),
					page: z.coerce.number().optional().default(1),
					limit: z.coerce.number().optional().default(2),
				}),
				response: {
					200: z.object({
						courses: z.array(
							z.object({
								id: z.uuid(),
								title: z.string(),
							})
						),
						metadata: z.object({
							total: z.number(),
							pages: z.number(),
							limit: z.number(),
							currentPage: z.number(),
						}),
					}),
				},
			},
		},
		async (request) => {
			const { search, sort, page, limit } = request.query;
			const condition = search
				? or(
						ilike(coursesTable.title, `%${search}%`),
						ilike(coursesTable.description, `%${search}%`)
					)
				: undefined;

			const [results, total] = await Promise.all([
				db
					.select({
						id: coursesTable.id,
						title: coursesTable.title,
					})
					.from(coursesTable)
					.orderBy(asc(coursesTable[sort]))
					.limit(limit)
					.offset((page - 1) * limit)
					.where(condition),
				db.$count(coursesTable, condition),
			]);
			const pages = Math.ceil(total / limit);

			return {
				courses: results,
				metadata: { total, pages, currentPage: page, limit },
			};
		}
	);
};
