import { eq } from "drizzle-orm";
import fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";
import { db } from "./database/client.ts";
import { coursesTable } from "./database/schema.ts";

const server = fastify({
	logger: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pip,hostname",
			},
		},
	},
}).withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.get("/health", () => {
	return { ok: true };
});

server.get("/courses", async () => {
	const results = await db
		.select({
			id: coursesTable.id,
			title: coursesTable.title,
		})
		.from(coursesTable);

	return { courses: results };
});

server.get(
	"/courses/:id",
	{
		schema: {
			params: z.object({
				id: z.uuid(),
			}),
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

server.post(
	"/courses",
	{
		schema: {
			body: z.object({
				title: z.string().min(1),
				description: z.string().optional(),
			}),
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

server.delete(
	"/courses/:id",
	{
		schema: {
			params: z.object({
				id: z.uuid(),
			}),
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

server.patch(
	"/courses/:id",
	{
		schema: {
			params: z.object({
				id: z.uuid(),
			}),
			body: z.object({
				title: z.string().optional(),
				description: z.string().optional(),
			}),
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

export { server };
