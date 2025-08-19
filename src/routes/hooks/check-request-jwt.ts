import type { FastifyReply, FastifyRequest } from "fastify";

import type { UserRoles } from "../../types/roles.ts";

type JWTPayload = {
	sub: string;
	role: UserRoles;
};

export const checkRequestJWT = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	try {
		const authHeader = request.headers.authorization;

		if (!authHeader?.startsWith("Bearer ")) {
			return reply.status(401).send();
		}

		const payload = await request.jwtVerify<JWTPayload>();
		request.user = payload;
	} catch {
		return reply.status(401).send();
	}
};
