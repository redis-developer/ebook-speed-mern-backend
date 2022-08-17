import type {
    Document
} from "../dependencies";

import { yup } from "../dependencies";
import { COLLECTIONS } from "../config/server-config";

import { GenericDatabaseCls } from "../utils/mongodb/generic-database";
import { YupCls } from "../utils/yup";

class MasterController {
    static async validateMastersByCategorySchema(_filter: Document): Promise<Document> {
        const schema = yup.object().shape({
            categories: yup.array().of(yup.string()).min(1)
        });

        //@ts-ignore 
        _filter = await YupCls.validateSchema(_filter, schema);

        return _filter;
    }
    static buildMastersByCategoryQuery(_filter: Document): Document[] {
        const compoundQueries: Document[] = [{
            range: {
                gt: 0,
                path: "statusCode",
            },
        }];


        if (_filter && _filter.categories && _filter.categories.length) {
            compoundQueries.push({
                text: {
                    query: _filter.categories,
                    path: "category",
                },
            });
        }


        return compoundQueries;
    }
    static async getMastersByCategory(_filter: Document): Promise<Document> {
        const output: Document = {};

        const collectionName = COLLECTIONS.MASTER_CATEGORIES.collectionName;

        if (_filter && Object.keys(_filter).length) {
            _filter = await MasterController.validateMastersByCategorySchema(_filter);
            const compoundQueries = MasterController.buildMastersByCategoryQuery(_filter);
            const pipelineArr = [
                {
                    $search: {
                        index: COLLECTIONS.MASTER_CATEGORIES.Indexes.INDEX_MASTER_CATEGORIES,
                        compound: {
                            must: compoundQueries,
                        },
                    },
                },
                {
                    $project: {
                        category: 1,
                        code: 1,
                        name: 1
                    }
                },
                {
                    $group: {
                        _id: "$category",
                        value: {
                            $push: "$$ROOT"
                        }
                    }
                }
            ];
            const masterCategories = await GenericDatabaseCls.aggregate({
                collectionName: collectionName,
                pipelineArr: pipelineArr,
                isInitializePipelineArr: false
            });

            //convert array to key-value object
            for (const masterCategory of masterCategories) {
                output[masterCategory["_id"]] = masterCategory["value"];
            }

        }
        else {
            throw "At least one key to filter is mandatory!";
        }

        return output;
    }
}


export {
    MasterController
};