import express from "express";
import registerProjects from "./controllers/projects";
import { drizzle } from "drizzle-orm/node-postgres";
import registerUsers from "./controllers/user";

const db = drizzle(process.env.DATABASE_URL!);
const app = express();

app.use(express.json());

registerProjects(app, db);
registerUsers(app, db);

app.listen(3000, "0.0.0.0", () => {
    console.log("Listening");
});
