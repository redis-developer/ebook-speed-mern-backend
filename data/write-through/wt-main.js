/* eslint-disable @typescript-eslint/no-var-requires */

/*
  Run this file by node  (eg: node wt-main.js )
*/

const fs = require("fs");
const redis = require("redis");
const dotenv = require("dotenv");
const redisConnectionUrl = process.env.REDIS_URL || "redis://localhost:6379";

dotenv.config();


const pythonFilePath = __dirname + "/write-through.py";

const runWriteThroughRecipe = async () => {
    const requirements = ["rgsync", "psycopg2-binary", "cryptography"];
    const writeThroughCode = fs
        .readFileSync(pythonFilePath);

    const client = redis.createClient({ url: redisConnectionUrl });
    if (client) {
        await client.connect();

        const params = ["RG.PYEXECUTE", writeThroughCode,
            "REQUIREMENTS", ...requirements];
        try {
            await client.sendCommand(params);
        }
        catch (err) {
            console.error("RedisGears WriteThrough setup failed !");
            console.error(JSON.stringify(err, Object.getOwnPropertyNames(err), 4));
        }
        await client.disconnect();
        console.log("RedisGears WriteThrough set up completed.");

        //process.exit();

    }

};


runWriteThroughRecipe();




