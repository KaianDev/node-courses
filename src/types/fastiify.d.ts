/** biome-ignore-all lint/correctness/noUnusedImports: module definition */
import fastify from "fastify";
import type { UserRoles } from "./roles";
import "@fastify/jwt";

declare module "fastify" {
	export interface FastifyRequest {
		user?: {
			sub: string;
			role: UserRoles;
		};
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: { role: UserRoles; sub: string };
	}
}
