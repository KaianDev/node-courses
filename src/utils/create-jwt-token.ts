import jwt from "jsonwebtoken";

import { env } from "../env.ts";
import type { UserRoles } from "../types/roles.ts";

export const createJWTToken = (user: { id: string; role: UserRoles }) => {
	const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET);
	return token;
};
