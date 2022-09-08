import type {
    Document
} from "../dependencies";

import { yup } from "../dependencies";
import { COLLECTIONS } from "../config/server-config";

import { GenericDatabaseCls } from "../utils/mongodb/generic-database";
import { YupCls } from "../utils/yup";
import { getServerConfig } from "../config/server-config";


class MasterController {
    static async validateMastersCategoriesSchema(_filter: Document): Promise<Document> {
        const schema = yup.object().shape({
            categories: yup.array().of(yup.string()).min(1)
        });

        //@ts-ignore 
        _filter = await YupCls.validateSchema(_filter, schema);

        return _filter;
    }
    static buildMasterCategoriesAtlasQuery(_filter: Document): Document {
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

        const atlasSearchQuery = {
            $search: {
                index: COLLECTIONS.MASTER_CATEGORIES.Indexes.INDEX_MASTER_CATEGORIES,
                compound: {
                    must: compoundQueries,
                },
            },
        };

        return atlasSearchQuery;
    }

    static async getMasterCategories(_filter: Document, _projection: Document): Promise<Document[]> {
        let output: Document[];
        const SERVER_CONFIG = getServerConfig();

        const collectionName = COLLECTIONS.MASTER_CATEGORIES.collectionName;

        if (_filter && Object.keys(_filter).length) {
            _filter = await MasterController.validateMastersCategoriesSchema(_filter);


            if (!_projection || Object.keys(_projection).length == 0) {
                _projection = {
                    category: 1,
                    code: 1,
                    name: 1,
                    _id: 0
                };
            }

            const pipelineArr: Document[] = [];

            if (SERVER_CONFIG.mongoDb.useAtlasIndexSearch) {
                const atlasSearchQuery = MasterController.buildMasterCategoriesAtlasQuery(_filter);
                pipelineArr.push(atlasSearchQuery);
            }

            pipelineArr.push({
                $project: _projection
            });

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