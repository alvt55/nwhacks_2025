import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Application, IRoute, Request, Response } from "express";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { projects } from "../db/schemas/projects";
import { projectCollaborators } from "../db/schemas/project-collaborators";
import { users } from "../db/schemas/users";

class ProjectsController {
    constructor(private readonly db: NodePgDatabase) {}

    generateKey(): string {
        const key = crypto.generateKeySync("aes", { length: 256 });
        const keyBase64 = key.export().toString("base64");
        return keyBase64;
    }

    async create(req: Request, res: Response) {
        const { name, ownerId } = req.body;

        const newProject: typeof projects.$inferInsert = {
            key: this.generateKey(),
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

        res.send({
            success: true,
            data: {
                key: project[0].key,
            },
        });
    }

    async rotateKey(req: Request, res: Response) {
        const { uuid } = req.query;

        if (!uuid || typeof uuid !== "string") {
            res.status(400).send({
                success: false,
                error: "No project UUID specified",
            });
            return;
        }

        const key = await this.db
            .update(projects)
            .set({
                key: this.generateKey(),
            })
            .where(eq(projects.uuid, uuid))
            .returning({
                key: projects.key,
            });

        res.send({
            success: true,
            data: {
                key: key[0],
            },
        });
    }

    async addCollaborator(req: Request, res: Response) {
        const { uuid, collaboratorId } = req.body;

        const project = await this.db
            .select({
                id: projects.id,
            })
            .from(projects)
            .where(eq(projects.uuid, uuid!.toString()));

        console.log(project[0]);

        await this.db.insert(projectCollaborators).values({
            projectId: +project[0].id,
            userId: +collaboratorId!,
        });

        res.status(200).send({
            success: true,
        });
    }

    async getCollaborators(req: Request, res: Response) {
        const { uuid } = req.query;

        const collaborators = await this.db
            .select({
                collaborator: projectCollaborators.userId,
            })
            .from(projects)
            .leftJoin(
                projectCollaborators,
                eq(projectCollaborators.projectId, projects.id),
            )
            .leftJoin(users, eq(users.id, projectCollaborators.userId))
            .where(eq(projects.uuid, uuid!.toString()));

        res.send({
            success: true,
            data: {
                collaborators: collaborators.map((c) => c.collaborator),
            },
        });
    }
}

export default function registerProjects(app: Application, db: NodePgDatabase) {
    const controller = new ProjectsController(db);

    app.post("/projects", controller.create.bind(controller));
    app.get("/projects/key", controller.getKey.bind(controller));
    app.put("/projects/key/rotate", controller.rotateKey.bind(controller));

    app.put(
        "/projects/collaborators/add",
        controller.addCollaborator.bind(controller),
    );
    app.get(
        "/projects/collaborators",
        controller.getCollaborators.bind(controller),
    );
}
