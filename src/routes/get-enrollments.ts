import { asc, eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";

import { db } from "../database/client.ts";
import {
	coursesTable,
	enrollmentsTable,
	usersTable,
} from "../database/schema.ts";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";

export const getEnrollmentsRoute: FastifyPluginCallbackZod = (server) => {
	server.get(
		"/enrollments",
		{
			preHandler: [checkRequestJWT, checkUserRole("manager")],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["enrollments"],
				summary: "List enrollments",
				operationId: "get_enrollments",
				querystring: z.object({
					sort: z
						.enum(["createdAt", "courseTitle", "studentName"])
						.optional()
						.default("createdAt"),
					page: z.coerce.number().optional().default(1),
					limit: z.coerce.number().optional().default(5),
				}),
				response: {
					200: z.object({
						enrollments: z.array(
							z.object({
								id: z.uuid(),
								createdAt: z.coerce.date(),
								user: z
									.object({
										id: z.uuid(),
										name: z.string(),
										role: z.enum(["student", "manager"]),
									})
									.nullable(),
								course: z
									.object({
										id: z.uuid(),
										title: z.string(),
									})
									.nullable(),
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
			const { sort, limit, page } = request.query;

			const getSortColumns = () => {
				switch (sort) {
					case "courseTitle":
						return coursesTable.title;
					case "createdAt":
						return enrollmentsTable.createdAt;
					case "studentName":
						return usersTable.name;
					default:
						return enrollmentsTable.createdAt;
				}
			};

			const sortColumn = getSortColumns();
			const [enrollments, total] = await Promise.all([
				db
					.select({
						id: enrollmentsTable.id,
						createdAt: enrollmentsTable.createdAt,
						user: {
							id: usersTable.id,
							name: usersTable.name,
							role: usersTable.role,
						},
						course: {
							id: coursesTable.id,
							title: coursesTable.title,
						},
					})
					.from(enrollmentsTable)
					.orderBy(asc(sortColumn))
					.limit(limit)
					.offset((page - 1) * limit)
					.leftJoin(
						coursesTable,
						eq(enrollmentsTable.courseId, coursesTable.id)
					)
					.leftJoin(usersTable, eq(enrollmentsTable.userId, usersTable.id)),
				db.$count(enrollmentsTable),
			]);

			const pages = Math.ceil(total / limit);

			return {
				enrollments,
				metadata: {
					total,
					pages,
					currentPage: page,
					limit,
				},
			};
		}
	);
};
