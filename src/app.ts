import crypto from "node:crypto";
import fastify from "fastify";

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

let courses = [
	{ id: "1", title: "Curso de Node.js" },
	{ id: "2", title: "Curso de React" },
	{ id: "3", title: "Curso de React Native" },
];

server.get("/health", () => {
	return { ok: true };
});

server.get("/courses", () => {
	return { courses };
});

server.get("/courses/:id", (request, reply) => {
	const { id } = request.params as { id: string };
	const course = courses.find((i) => i.id === id);

	if (!course) {
		return reply.status(404).send();
	}

	return { course };
});

server.post("/courses", (request, reply) => {
	const { title } = request.body as { title?: string };

	if (!title) {
		return reply.status(400).send({ message: "Title is required" });
	}

	const courseId = crypto.randomUUID();
	courses.push({ id: courseId, title });
	reply.status(201).send({ courseId });
});

server.delete("/courses/:id", (request, reply) => {
	const { id } = request.params as { id: string };

	const course = courses.find((item) => item.id === id);
	courses = courses.filter((item) => item.id !== id);

	if (!course) {
		return reply.status(404).send();
	}

	return reply.status(204).send();
});

server.patch("/courses/:id", (request, reply) => {
	const { id } = request.params as { id: string };
	const { title } = request.body as { title?: string };

	const hasCourseWithId = courses.find((item) => item.id === id);

	if (!hasCourseWithId) {
		return reply.status(404).send();
	}

	courses = courses.map((item) => {
		if (item.id === id && title) {
			return {
				...item,
				title,
			};
		}
		return item;
	});

	return reply.status(204).send();
});

export { server };
