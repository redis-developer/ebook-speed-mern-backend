/* eslint-disable @typescript-eslint/no-var-requires */

/*
  Run this file by node  (eg: node wt-main.js )
*/

const fs = require("fs");
const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

//-----CONNECTION -------
const redisConnectionUrl = process.env.REDIS_URL || "redis://localhost:6379";
const mongoDB = {
    // adminUser: "",
    // adminPassword: "",
    // host: "",
    connectionUrl: process.env.MONGODB_URL || "mongodb://localhost:27017/dbSpeedMernDemo"
};
//----- CONNECTION ENDS -------

const pythonFilePath = __dirname + "/movies-write-through.py";

const runWriteThroughRecipe = async () => {
    const requirements = ["rgsync", "pymongo==3.12.0"];
    const writeThroughCode = fs
        .readFileSync(pythonFilePath)
        .toString()
        // .replace("ADMIN_USER", mongoDB.adminUser)
        // .replace("ADMIN_PASSWORD", mongoDB.adminPassword)
        // .replace("ADMIN_HOST", mongoDB.host)
        .replace("MONGODB_CONNECTION_URL", mongoDB.connectionUrl);

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




