import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const projects = pgTable("projects", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: uuid().notNull().defaultRandom(),
    name: text().notNull(),
    ownerId: integer()
        .notNull()
        .references(() => users.id),
    key: text().notNull(),
});
