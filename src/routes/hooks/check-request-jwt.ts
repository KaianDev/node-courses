import type {
	FastifyReply,
	FastifyRequest,
	HookHandlerDoneFunction,
} from "fastify";
import jwt from "jsonwebtoken";

import { env } from "../../env.ts";
import type { UserRoles } from "../../types/roles.ts";

type JWTPayload = {
	sub: string;
	role: UserRoles;
};

export const checkRequestJWT = (
	request: FastifyRequest,
	reply: FastifyReply,
	done: HookHandlerDoneFunction
) => {
	const token = request.headers.authorization;

	if (!token) {
		return reply.status(401).send();
	}

	try {
		const payload = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
		request.user = payload;
		done();
	} catch {
		return reply.status(401).send();
	}
};
