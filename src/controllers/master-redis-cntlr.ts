import type {
    Document
} from "../dependencies";

import { MasterController } from "./master-cntlr";
import * as MasterCategoryRepo from "../models/redis/master-category-repo";

class MasterRedisController {

    static insertMasterCategoriesToRedis() {

        const promObj: Promise<boolean> = new Promise((resolve, reject) => {

            const filter = {
                categories: ["COUNTRY", "LANGUAGE"]
            };
            const projection = {
                category: 1,
                code: 1,
                name: 1,
                _id: 1,
                statusCode: 1
            };
            const innerPromObj = MasterController.getMasterCategories(filter, projection);

            innerPromObj
                .then((_dataArr) => {
                    let retPromObj = null;
                    const repository = MasterCategoryRepo.getRepository();

                    if (repository && _dataArr && _dataArr instanceof Array && _dataArr.length) {
                        const promObjArr = [];
                        for (const record of _dataArr) {
                            const entity = repository.createEntity(record);

                            //@ts-ignore
                            entity.entityId = record._id.toString(); //using same mongodb key as redis key
                            entity.categoryTag = [entity.category]; //for tag search

                            const insertPromObj = repository.save(entity);
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

    static async getMasterCategoriesFromRedis(_filter: Document): Promise<Document> {
        const promObj: Promise<Document> = new Promise((resolve, reject) => {
            const repository = MasterCategoryRepo.getRepository();

            if (repository && _filter && _filter.categories && _filter.categories.length) {
                const queryBuilder = repository.search()
                    .where("statusCode").gt(0)
                    .and("categoryTag").containOneOf(..._filter.categories);

                console.log(queryBuilder.query);

                const innerPromObj = queryBuilder.return.all();
                innerPromObj
                    .then((dataArr) => {
                        const newDataArr = dataArr.map((elm) => {
                            return {
                                category: elm.category,
                                code: elm.code,
                                name: elm.name
                            };
                        });
                        resolve(newDataArr);
                    })
                    .catch((err) => {
                        reject(err);
                    });


            }
            else {
                reject("At least one key to filter is mandatory!");
            }
        });

        return promObj;
    }

}


export {
    MasterRedisController
};