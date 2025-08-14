import fastify from "fastify";

const server = fastify();

server.get("/health", () => {
	return { ok: true };
});

export { server };
