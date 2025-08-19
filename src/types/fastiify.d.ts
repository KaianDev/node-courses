/** biome-ignore-all lint/correctness/noUnusedImports: module definition */

import type { OAuth2Namespace } from "@fastify/oauth2";
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

	export interface FastifyInstance {
		googleOAuth2: OAuth2Namespace;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: { role: UserRoles; sub: string };
	}
}
