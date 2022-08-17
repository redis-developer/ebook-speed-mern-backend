import type { Express, Request, Response } from "./dependencies";
import { express, dotenv, cors } from "./dependencies";

import { getServerConfig } from "./config/server-config";
import { router } from "./controllers/routes";
import { setMongodb } from "./utils/mongodb/node-mongo-wrapper";

dotenv.config();
const SERVER_CONFIG = getServerConfig();

const app: Express = express();
const port = SERVER_CONFIG.httpServer.port;

app.use(cors());

app.use(express.json());

app.use(SERVER_CONFIG.httpServer.apiPrefix, router);

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, async () => {
    //connect mongodb
    await setMongodb(SERVER_CONFIG.mongoDb.connectionUrl, SERVER_CONFIG.mongoDb.dbName);

    console.log(`Server is running at http://localhost:${port}`);
});