/* eslint-disable @typescript-eslint/no-var-requires */

/*
  Run this file by node  (eg: node wb-main.js )
*/

const fs = require("fs");
const redis = require("redis");

//-----CONNECTION -------
const redisConnectionUrl = "redis://10.0.1.1:6379";
const mongoDB = {
    // adminUser: "usrAdmin",
    // adminPassword: "passwordAdmin",
    // host: "10.10.20.2:27017/admin",
    connectionUrl: "mongodb://usrAdmin:passwordAdmin@10.10.20.2:27017/admin"
};
//----- CONNECTION ENDS -------

const pythonFilePath = __dirname + "/movies-write-behind.py";

const runWriteBehindRecipe = async () => {
    const requirements = ["rgsync", "pymongo==3.12.0"];
    const writeBehindCode = fs
        .readFileSync(pythonFilePath)
        .toString()
        // .replace("ADMIN_USER", mongoDB.adminUser)
        // .replace("ADMIN_PASSWORD", mongoDB.adminPassword)
        // .replace("ADMIN_HOST", mongoDB.host)
        .replace("MONGODB_CONNECTION_URL", mongoDB.connectionUrl);

    const client = redis.createClient({ url: redisConnectionUrl });
    if (client) {
        await client.connect();

        const params = ["RG.PYEXECUTE", writeBehindCode,
            "REQUIREMENTS", ...requirements];
        try {
            await client.sendCommand(params);
            console.log("RedisGears WriteBehind set up completed.");
        }
        catch (err) {
            console.error("RedisGears WriteBehind setup failed !");
            console.error(JSON.stringify(err, Object.getOwnPropertyNames(err), 4));
        }
        process.exit();

    }

};


runWriteBehindRecipe();




