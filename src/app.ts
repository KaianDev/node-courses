import { fastifySwagger } from "@fastify/swagger";
import scalarFastifyApiReference from "@scalar/fastify-api-reference";
import fastify from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { env } from "./env.ts";
import { createCourseRoute } from "./routes/create-course.ts";
import { deleteCourseRoute } from "./routes/delete-course.ts";
import { getCourseByIdRoute } from "./routes/get-course-by-id.ts";
import { getCoursesRoute } from "./routes/get-courses.ts";
import { healthRoute } from "./routes/health.ts";
import { registerStudentRoute } from "./routes/register-student.ts";
import { updateCourseRoute } from "./routes/update-course.ts";

const server = fastify({
	logger: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pip,hostname",
			},
		},
	},
}).withTypeProvider<ZodTypeProvider>();

if (env.NODE_ENV === "development") {
	server.register(fastifySwagger, {
		openapi: {
			info: {
				title: "Courses",
				version: "1.0.0",
			},
		},
		transform: jsonSchemaTransform,
	});

	server.register(scalarFastifyApiReference, {
		routePrefix: "/docs",
	});
}

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(healthRoute);
server.register(getCoursesRoute);
server.register(getCourseByIdRoute);
server.register(createCourseRoute);
server.register(deleteCourseRoute);
server.register(updateCourseRoute);
server.register(registerStudentRoute);

export { server };
