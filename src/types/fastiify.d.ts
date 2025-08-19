/** biome-ignore-all lint/correctness/noUnusedImports: module definition */
import fastify from "fastify";
import type { UserRoles } from "./roles";

declare module "fastify" {
	export interface FastifyRequest {
		user?: {
			sub: string;
			role: UserRoles;
		};
	}
}
