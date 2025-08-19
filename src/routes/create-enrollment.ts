import { and, eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";

import { db } from "../database/client.ts";
import { coursesTable, enrollmentsTable } from "../database/schema.ts";
import { getAuthenticatedUserFromRequest } from "../utils/get-authenticated-user-from-request.ts";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";

export const createEnrollment: FastifyPluginCallbackZod = (server) => {
	server.post(
		"/enrollments",
		{
			preHandler: [checkRequestJWT],
			schema: {
				tags: ["enrollments"],
				summary: "Create a enrollment",
				operationId: "create_enrollment",
				body: z.object({
					courseId: z.uuid(),
				}),
				response: {
					201: z
						.object({
							enrollmentId: z.uuid(),
						})
						.describe("Matrícula registrada com sucesso"),
					404: z.null().describe("Curso não encontrado"),
					409: z
						.object({
							error: z.string(),
						})
						.describe("Usuário já matriculado nesse curso"),
				},
			},
		},
		async (request, reply) => {
			const user = getAuthenticatedUserFromRequest(request);
			const { courseId } = request.body;

			const courses = await db
				.select({ id: coursesTable.id })
				.from(coursesTable)
				.where(eq(coursesTable.id, courseId));

			if (courses.length === 0) {
				reply.status(404).send();
			}

			const enrollments = await db
				.select()
				.from(enrollmentsTable)
				.where(
					and(
						eq(enrollmentsTable.courseId, courseId),
						eq(enrollmentsTable.userId, user.sub)
					)
				);

			if (enrollments.length > 0) {
				return reply
					.status(409)
					.send({ error: "User is already enrolled in the course" });
			}

			const result = await db
				.insert(enrollmentsTable)
				.values({ courseId, userId: user.sub })
				.returning();

			return reply.status(201).send({ enrollmentId: result[0].id });
		}
	);
};
