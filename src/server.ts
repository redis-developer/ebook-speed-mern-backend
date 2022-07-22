import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getServerConfig } from "./config/server-config";
import { router } from "./controllers/routes";

dotenv.config();
const SERVER_CONFIG = getServerConfig();


const app: Express = express();
const port = SERVER_CONFIG.httpServer.port;

app.use(express.json());

app.use(SERVER_CONFIG.httpServer.apiPrefix, router);

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});