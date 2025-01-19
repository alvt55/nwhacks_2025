import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const projects = pgTable("projects", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: uuid().notNull().defaultRandom(),
    name: text().notNull(),
    ownerId: integer().notNull(),
    key: text().notNull(),
});

export const projectsRelatons = relations(projects, ({ one, many }) => ({
    owner: one(users, {
        fields: [projects.ownerId],
        references: [users.id],
    }),
    collaborators: many(users),
}));
