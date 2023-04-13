import type { Express, Request, Response } from "./dependencies";
import { express, dotenv, cors } from "./dependencies";

import { getServerConfig } from "./config/server-config";
import { router } from "./controllers/routes";
import { setMongodb } from "./utils/mongodb/node-mongo-wrapper";
import { setRedisOm } from "./utils/redis/redis-om-wrapper";

import * as MovieRepo from "./models/redis/movie-repo";
import * as MasterCategoryRepo from "./models/redis/master-category-repo";
import { MasterRedisController } from "./controllers/master-redis-cntlr";

const createAllRedisIndexes = () => {
    const indexPromObj = MovieRepo.createIndex();
    const indexPromObj2 = MasterCategoryRepo.createIndex();
    return Promise.all([indexPromObj, indexPromObj2]);
};

const setUpRedis = () => {
    //connect redis
    const redisPromObj = setRedisOm(SERVER_CONFIG.redis.connectionUrl);
    const redisPromObj2 = redisPromObj
        .then(() => {
            return createAllRedisIndexes();
        })
        .then(() => {
            console.log("Redis Indexes created !");
            //Master data lookup pattern (preload data in cache)
            return MasterRedisController.insertMasterCategoriesToRedis();
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });

    return redisPromObj2;
};

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
    const mongoPromObj = setMongodb(SERVER_CONFIG.mongoDb.connectionUrl, SERVER_CONFIG.mongoDb.dbName);
    const redisPromObj = setUpRedis();
    await Promise.all([mongoPromObj, redisPromObj]);

    console.log(`Server is running at http://localhost:${port}`);
});