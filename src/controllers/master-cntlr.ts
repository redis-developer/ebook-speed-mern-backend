import type {
    Document
} from "../dependencies";

import { yup } from "../dependencies";
import { COLLECTIONS } from "../config/server-config";

import { GenericDatabaseCls } from "../utils/mongodb/generic-database";
import { YupCls } from "../utils/yup";

class MasterController {
    static async validateMastersCategoriesSchema(_filter: Document): Promise<Document> {
        const schema = yup.object().shape({
            categories: yup.array().of(yup.string()).min(1)
        });

        //@ts-ignore 
        _filter = await YupCls.validateSchema(_filter, schema);

        return _filter;
    }
    static buildMasterCategoriesQuery(_filter: Document): Document[] {
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
    static async getMasterCategories(_filter: Document, _projection: Document): Promise<Document[]> {
        let output: Document[];

        const collectionName = COLLECTIONS.MASTER_CATEGORIES.collectionName;

        if (_filter && Object.keys(_filter).length) {
            _filter = await MasterController.validateMastersCategoriesSchema(_filter);
            const compoundQueries = MasterController.buildMasterCategoriesQuery(_filter);

            if (!_projection || Object.keys(_projection).length == 0) {
                _projection = {
                    category: 1,
                    code: 1,
                    name: 1,
                    _id: 0
                };
            }

            const pipelineArr: Document[] = [
                {
                    $search: {
                        index: COLLECTIONS.MASTER_CATEGORIES.Indexes.INDEX_MASTER_CATEGORIES,
                        compound: {
                            must: compoundQueries,
                        },
                    },
                },
                {
                    $project: _projection
                }
            ];

            output = await GenericDatabaseCls.aggregate({
                collectionName: collectionName,
                pipelineArr: pipelineArr,
                isInitializePipelineArr: false
            });
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