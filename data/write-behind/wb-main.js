/* eslint-disable @typescript-eslint/no-var-requires */

/*
  Run this file by node 
  eg: node data/write-behind/wb-main.js
*/

const fs = require("fs");
const redis = require("redis");

//-----CONNECTION -------
const redisConnectionUrl = "redis://10.0.1.1:6379";
const mongoDB = {
    adminUser: "usrAdmin",
    adminPassword: "usr_Admin",
    host: "10.10.10.1:27017/admin"
};
//----- CONNECTION ENDS -------

const pythonFilePath = __dirname + "/movies-write-behind.py";

const runWriteBehindRecipe = async () => {
    const requirements = ["rgsync", "pymongo==3.12.0"];
    const writeBehindCode = fs
        .readFileSync(pythonFilePath)
        .toString()
        .replace("ADMIN_USER", mongoDB.adminUser)
        .replace("ADMIN_PASSWORD", mongoDB.adminPassword)
        .replace("ADMIN_HOST", mongoDB.host);

    const client = redis.createClient({ url: redisConnectionUrl });
    if (client) {
        await client.connect();

        client.sendCommand(
            [
                "RG.PYEXECUTE",
                writeBehindCode,
                "REQUIREMENTS",
                ...requirements
            ]
        )
            .then(() => {
                console.log("RedisGears WriteBehind set up completed.");
                process.exit();

            })
            .catch((err) => {
                console.error("RedisGears WriteBehind setup failed !");
                console.error(JSON.stringify(err, Object.getOwnPropertyNames(err), 4));
                process.exit(1);
            });
    }

};


runWriteBehindRecipe();




