import { MasterController } from "./master-cntlr";
import * as MasterCategoryRepo from "../models/redis/master-category-repo";

class MasterRedisController {

    static insertMasterCategoriesToRedis() {

        const promObj: Promise<boolean> = new Promise((resolve, reject) => {

            const filter = {
                categories: ["COUNTRY", "LANGUAGE"]
            };
            const innerPromObj = MasterController.getMastersByCategory(filter, false);

            innerPromObj
                .then((_dataArr) => {
                    let retPromObj = null;
                    const repository = MasterCategoryRepo.getRepository();

                    if (repository && _dataArr && _dataArr instanceof Array) {
                        const promObjArr = [];
                        for (const record of _dataArr) {
                            const entity = repository.createEntity(record);

                            //@ts-ignore
                            entity.entityId = record._id.toString(); //use same mongodb key as redis key

                            const insertPromObj = repository.save(entity); //createAndSave = createEntity + save
                            promObjArr.push(insertPromObj);
                        }

                        retPromObj = Promise.all(promObjArr);
                    }

                    return retPromObj;
                })
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    reject(err);
                });

        });

        return promObj;
    }

}


export {
    MasterRedisController
};