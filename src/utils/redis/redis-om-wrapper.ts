import { RedisOmClient } from "../../dependencies";
import { LoggerCls } from "../logger";

class RedisOmWrapperCls {
    connectionURL: string;
    client: RedisOmClient | null;

    constructor(_connectionURL: string) {
        this.connectionURL = _connectionURL;
        this.client = null;
    }

    getConnection(): Promise<RedisOmClient> {
        let promObj: Promise<RedisOmClient> = new Promise((resolve, reject) => {
            if (this.connectionURL) {
                const redisOmInst = new RedisOmClient();
                redisOmInst.open(this.connectionURL)
                    .then((client) => {
                        this.client = client;
                        resolve(client);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }
        });

        promObj = promObj.catch((err) => {
            LoggerCls.error("redis-om-wrapper getConnection()", err);
            throw err;
        });
        return promObj;
    }

    //Later can add CRUD, bulk operations & aggregate wrapper methods
}

let redisOmWrapperInst: RedisOmWrapperCls;

const setRedisOm = async (_connectionURL: string): Promise<RedisOmClient> => {
    redisOmWrapperInst = new RedisOmWrapperCls(_connectionURL);
    const client = await redisOmWrapperInst.getConnection();
    return client;
};

const getRedisOm = (): RedisOmWrapperCls => {
    return redisOmWrapperInst;
};

export {
    setRedisOm,
    getRedisOm
};

export type {
    RedisOmWrapperCls
};