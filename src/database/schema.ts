import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: uuid().primaryKey().defaultRandom(),
	name: text().notNull(),
	email: text().notNull().unique(),
});

export const coursesTable = pgTable("courses", {
	id: uuid().primaryKey().defaultRandom(),
	title: text().notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const enrollmentsTable = pgTable("enrollments", {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid()
		.notNull()
		.references(() => usersTable.id),
	courseId: uuid()
		.notNull()
		.references(() => coursesTable.id),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});
