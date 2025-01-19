import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Application, Request, Response } from "express";
import { users } from "../db/schemas/users";
import { projects } from "../db/schemas/projects";
import { eq } from "drizzle-orm";
import { projectCollaborators } from "../db/schemas/project-collaborators";

class UsersController {
    constructor(private readonly db: NodePgDatabase) {}

    async create(req: Request, res: Response) {
        const { email } = req.body;

        if (!email || typeof email !== "string") {
            res.status(400).send({
                success: false,
                error: "Invalid email",
            });
            return;
        }

        const newUser: typeof users.$inferInsert = {
            email: email,
        };

        let id;
        try {
            const user = await this.db.insert(users).values(newUser).returning({
                id: users.id,
            });

            id = user[0].id;
        } catch (err) {
            res.status(400).send({
                success: false,
                error: "Failed to create account",
            });
            return;
        }

        res.send({
            success: true,
            message: "Successfully created account",
            data: {
                id: id,
            },
        });
    }

    async getProjects(req: Request, res: Response) {
        const { id } = req.query;

        if (!id || typeof id !== "string") {
            res.status(400).send({
                success: false,
                error: "No user id specified",
            });
            return;
        }

        let userProjects;
        try {
            userProjects = await this.db
                .select({
                    uuid: projects.uuid,
                    name: projects.name,
                    ownerId: projects.ownerId,
                })
                .from(projects)
                .where(eq(projects.ownerId, +id!));

        } catch (err) {
            console.error(err);
            res.status(500).send({
                success: false,
                error: "Failed to retrieve projects",
            });
            return;
        }

        res.send({
            success: true,
            data: {
                projects: userProjects,
            },
        });
    }
}

export default function registerUsers(app: Application, db: NodePgDatabase) {
    const controller = new UsersController(db);

    app.post("/users", controller.create.bind(controller));
    app.get("/users/projects", controller.getProjects.bind(controller));
}
