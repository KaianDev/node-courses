import { eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";

import { db } from "../database/client.ts";
import { usersTable } from "../database/schema.ts";

export const loginGoogleRoute: FastifyPluginCallbackZod = (server) => {
	server.get(
		"/login/google/callback",
		{
			schema: {
				hide: true,
			},
		},
		async function (request, reply) {
			try {
				const { token } =
					await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
						request
					);

				const userInfo = (await fetch(
					"https://www.googleapis.com/oauth2/v2/userinfo",
					{
						headers: { Authorization: `Bearer ${token.access_token}` },
					}
				).then((res) => res.json())) as {
					email: string;
					name: string;
				};

				if (userInfo) {
					const results = await db
						.select({ id: usersTable.id, role: usersTable.role })
						.from(usersTable)
						.where(eq(usersTable.email, userInfo.email));

					if (results.length === 0) {
						const insertUserResults = await db
							.insert(usersTable)
							.values({
								email: userInfo.email,
								name: userInfo.name,
								role: "student",
								password: "",
							})
							.returning();
						console.log("User added");

						const tokenJWT = await reply.jwtSign({
							role: insertUserResults[0].role,
							sub: insertUserResults[0].id,
						});

						return { token: tokenJWT };
					}

					const tokenJWT = await reply.jwtSign({
						role: results[0].role,
						sub: results[0].id,
					});
					return { token: tokenJWT };
				}

				reply.send({ access_token: token.access_token, userInfo });
			} catch {
				reply.send(500).send();
			}
		}
	);
};
