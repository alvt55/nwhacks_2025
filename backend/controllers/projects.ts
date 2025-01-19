import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Application, IRoute, Request, Response } from "express";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { projects } from "../db/schemas/projects";

class ProjectsController {
    constructor(private readonly db: NodePgDatabase) {}

    async create(req: Request, res: Response) {
        const { name, ownerId } = req.body;

        const key = crypto.generateKeySync("aes", { length: 256 });
        const keyBase64 = key.export().toString("base64");

        const newProject: typeof projects.$inferInsert = {
            key: keyBase64,
            name: name,
            ownerId: ownerId,
        };

        const project = await this.db
            .insert(projects)
            .values(newProject)
            .returning({
                uuid: projects.uuid,
            });

        res.send({
            success: true,
            data: {
                uuid: project[0].uuid,
            },
        });
    }

    async getKey(req: Request, res: Response) {
        const { uuid } = req.query;

        if (!uuid || typeof uuid !== "string") {
            res.status(400).send({
                success: false,
                error: "No project UUID specified",
            });
            return;
        }

        const project = await this.db
            .select({
                key: projects.key,
            })
            .from(projects)
            .where(eq(projects.uuid, uuid))
            .limit(1);

        if (project.length === 0) {
            res.status(400).send({
                success: false,
                error: "Invalid project",
            });
            return;
        }

        console.log(await this.db.select().from(projects));

        res.send({
            success: true,
            data: {
                key: project[0].key,
            },
        });
    }
}

export default function registerProjects(app: Application, db: NodePgDatabase) {
    const controller = new ProjectsController(db);

    app.post("/projects", controller.create.bind(controller));
    app.get("/projects/key", controller.getKey.bind(controller));
}
