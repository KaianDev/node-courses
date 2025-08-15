import { eq } from "drizzle-orm";
import fastify from "fastify";
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
});

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

server.get("/courses/:id", async (request, reply) => {
	const { id } = request.params as { id: string };

	const results = await db
		.select()
		.from(coursesTable)
		.where(eq(coursesTable.id, id));

	if (results.length > 0) {
		return { course: results[0] };
	}

	return reply.status(404).send();
});

server.post("/courses", async (request, reply) => {
	const { title, description } = request.body as {
		title?: string;
		description?: string;
	};

	if (!title) {
		return reply.status(400).send({ message: "Title is required" });
	}

	const result = await db
		.insert(coursesTable)
		.values({ title, description })
		.returning();

	return reply.status(201).send({ courseId: result[0].id });
});

server.delete("/courses/:id", async (request, reply) => {
	const { id } = request.params as { id: string };

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
});

server.patch("/courses/:id", async (request, reply) => {
	const { id } = request.params as { id: string };
	const { title, description } = request.body as {
		title?: string;
		description?: string;
	};

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
});

export { server };
