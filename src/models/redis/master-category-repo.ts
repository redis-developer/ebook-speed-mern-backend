import { RedisEntity, RedisSchema } from "../../dependencies";
import { getRedisOm } from "../../utils/redis/redis-om-wrapper";

class MasterCategoryEntity extends RedisEntity {
}

const schema = new RedisSchema(MasterCategoryEntity, {
    category: { type: "string" },
    code: { type: "string" },
    name: { type: "string" }
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