import { randomUUID } from "node:crypto";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { hash } from "argon2";

import { db } from "../../database/client.ts";
import { usersTable } from "../../database/schema.ts";
import type { UserRoles } from "../../types/roles.ts";
import { createJWTToken } from "../../utils/create-jwt-token.ts";

export const makeUser = async (role?: UserRoles) => {
	const passwordBeforeHash = randomUUID();
	const result = await db
		.insert(usersTable)
		.values({
			name: faker.person.fullName(),
			email: faker.internet.email(),
			role,
			password: await hash(passwordBeforeHash),
		})
		.returning();

	return { user: result[0], passwordBeforeHash };
};

export const makeAuthenticatedUser = async (role: UserRoles) => {
	const { user } = await makeUser(role);

	const token = createJWTToken(user);

	return { token, user };
};
