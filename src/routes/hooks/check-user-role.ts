import type {
	FastifyReply,
	FastifyRequest,
	HookHandlerDoneFunction,
} from "fastify";
import type { UserRoles } from "../../types/roles.ts";
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts";

export const checkUserRole = (role: UserRoles) => {
	return (
		request: FastifyRequest,
		reply: FastifyReply,
		done: HookHandlerDoneFunction
	) => {
		const user = getAuthenticatedUserFromRequest(request);

		if (user.role !== role) {
			return reply.status(401).send();
		}

		done();
	};
};
