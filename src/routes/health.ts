import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";

export const healthRoute: FastifyPluginCallbackZod = (server) => {
	server.get(
		"/health",
		{
			schema: {
				tags: ["health"],
				summary: "Check server health",
				response: {
					200: z.object({
						status: z.string(),
					}),
				},
			},
		},
		() => {
			return { status: "OK" };
		}
	);
};
