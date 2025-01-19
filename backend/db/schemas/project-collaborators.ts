import { integer, pgTable, unique } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { users } from "./users";

export const projectCollaborators = pgTable(
    "project_collaborators",
    {
        projectId: integer()
            .notNull()
            .references(() => projects.id),
        userId: integer()
            .notNull()
            .references(() => users.id),
    },
    (p) => [
        {
            uniqueCollaborator: unique().on(p.projectId, p.userId),
        },
    ],
);
