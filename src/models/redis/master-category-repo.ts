import type { IMasterCategory } from "../master-category-mdl";

import { RedisEntity, RedisSchema } from "../../dependencies";
import { getRedisOm } from "../../utils/redis/redis-om-wrapper";

//for typescript
interface MasterCategoryEntity extends IMasterCategory {
    categoryTag: string[];
}

//for redis
class MasterCategoryEntity extends RedisEntity {
}

//for redis
const schema = new RedisSchema(MasterCategoryEntity, {
    category: { type: "string" },
    categoryTag: { type: "string[]" },
    code: { type: "string" },
    name: { type: "string" },
    statusCode: { type: "number" }
});

const getRepository = () => {
    const redisOmWrapperInst = getRedisOm();
    return redisOmWrapperInst.client?.fetchRepository(schema);
};

const createIndex = async () => {
    const repository = getRepository();
    if (repository) {
        await repository.createIndex();
    }
};

export {
    getRepository,
    createIndex
};