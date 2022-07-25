import type {
    Filter, Document,
    CstObjectIdType,
} from "../../dependencies";
import type {
    CstDocumentType, IParamsInsertDocument, IParamsGetDocuments, IParamsUpdateDocumentById, IParamsInsertManyDocuments
} from "./generic-database.types";

import {
    DB_ROW_STATUS, DEFAULT_LIMIT
} from "./generic-database.types";
import { ObjectId } from "../../dependencies";
import { getMongodb } from "./node-mongo-wrapper";
import { LoggerCls } from "../logger";
import { DateCls } from "../date";
import { LodashCls } from "../lodash";


class GenericDatabaseCls {

    //#region utils
    static convertStringToObjectId(_id: CstObjectIdType): CstObjectIdType {
        const regexItem = /^[a-f\d]{24}$/i;

        if (_id && typeof _id == "string" && regexItem.test(_id)) {
            _id = new ObjectId(_id);
        }
        return _id;
    }

    static convertStringArrToObjectIdArr(_ids: CstObjectIdType[]): CstObjectIdType[] {

        if (_ids && _ids.length) {
            _ids = Array.from(_ids, (elm) => {
                return GenericDatabaseCls.convertStringToObjectId(elm);
            });
        }

        return _ids;
    }

    static addCommonFieldsToDocument(_document: CstDocumentType, _byUser: string, _isAddId: boolean) {

        if (_document && Object.keys(_document).length) {

            if (_isAddId) {
                _document._id = new ObjectId();
            }

            _document.createdOn = (new Date()).toISOString();
            _document.createdBy = _byUser;

            _document.lastUpdatedOn = null;
            _document.lastUpdatedBy = null;

            if (!_document.statusCode && _document.statusCode != 0) {
                _document.statusCode = DB_ROW_STATUS.ACTIVE;
            }
        }

        return _document;
    }

    //#endregion utils


    static insertDocument(_params: IParamsInsertDocument): Promise<string> {
        const mongodbWrapperInst = getMongodb();

        let promObj: Promise<string> = new Promise((resolve, reject) => {
            if (_params.collectionName && _params.createdBy && _params.document && Object.keys(_params.document).length) {

                _params.document = GenericDatabaseCls.addCommonFieldsToDocument(_params.document, _params.createdBy, false);

                _params.document = DateCls.convertNestedISOStringToDate(_params.document);

                const promObj2 = mongodbWrapperInst.insertOne(_params.collectionName, _params.keyName, _params.document, _params.session);
                resolve(promObj2);

            } else {
                reject("Input params validation failed !");
            }
        });


        promObj = promObj.catch((err) => {
            LoggerCls.error("generic-database insertDocument()", err);
            throw err;
        });

        return promObj;
    }

    static getDocuments(_params: IParamsGetDocuments): Promise<Document[]> {
        const mongodbWrapperInst = getMongodb();

        let promObj: Promise<Document[]> = new Promise((resolve, reject) => {
            if (_params.collectionName) {

                let filter: Filter<Document> = _params.filter || {};
                const sort = _params.sort || {};
                const keyName = _params.keyName || "_id";
                const limit = _params.limit || DEFAULT_LIMIT.FIND_DOCUMENTS;
                const projection = _params.projection || {
                    [keyName]: 1,
                };

                if (keyName != "_id") {
                    projection._id = 0;
                }

                //----FILTER
                let filterKey = keyName;
                if (filter["_id"]) {
                    filterKey = "_id";
                }

                if (filter[filterKey]) {

                    if (filter[filterKey] instanceof Array) {

                        filter[filterKey] = {
                            $in: GenericDatabaseCls.convertStringArrToObjectIdArr(filter[filterKey])
                        };
                    }
                    else {
                        filter[filterKey] = {
                            $eq: GenericDatabaseCls.convertStringToObjectId(filter[filterKey])
                        };
                    }
                }

                if (!filter.statusCode && filter.statusCode != 0) {
                    filter.statusCode = {
                        $gt: 0
                    };
                }
                if (_params.createdBy) {
                    filter.createdBy = _params.createdBy;
                }

                filter = DateCls.convertNestedISOStringToDate(filter);
                //----FILTER ends

                const promObj2 = mongodbWrapperInst.find(_params.collectionName, filter, projection, limit, sort);
                resolve(promObj2);
            } else {
                reject("Input params validation failed!");
            }
        });

        promObj = promObj.catch((err) => {
            LoggerCls.error("generic-database getDocuments()", err);
            throw err;
        });

        return promObj;
    }

    static updateDocumentById(_params: IParamsUpdateDocumentById): Promise<CstObjectIdType> {
        const mongodbWrapperInst = getMongodb();

        let promObj: Promise<CstObjectIdType> = new Promise((resolve, reject) => {

            if (_params.id && _params.keyName && _params.collectionName && _params.updatedBy && _params.document) {
                _params.document = Object.assign({}, _params.document);

                const filter: Filter<Document> = {};

                if (_params.id) {
                    filter["_id"] = GenericDatabaseCls.convertStringToObjectId(_params.id);
                }

                let documentLastUpdatedOn = _params.document.lastUpdatedOn || null;
                if (documentLastUpdatedOn) {
                    if (typeof documentLastUpdatedOn == "string") {
                        documentLastUpdatedOn = DateCls.convertISOStringToDate(documentLastUpdatedOn);
                    }
                    filter.lastUpdatedOn = { //to prevent update conflict
                        $eq: documentLastUpdatedOn
                    };
                }

                //skipping non updatable keys----------------------------
                if (_params.document["_id"]) {
                    delete _params.document["_id"];
                }
                if (_params.document[_params.keyName]) {
                    delete _params.document[_params.keyName];
                }

                if (_params.document.createdOn) {
                    delete _params.document.createdOn;
                }
                if (_params.document.createdBy) {
                    delete _params.document.createdBy;
                }

                //skipping non updatable keys ends----------------------------


                mongodbWrapperInst.find(_params.collectionName, filter, {}, 1, {})
                    .then((dataArr) => {
                        if (dataArr && dataArr instanceof Array && dataArr.length) {
                            const originalDocument = dataArr[0];

                            let modifiedDocument: Document = LodashCls.merge(originalDocument, _params.document);

                            modifiedDocument.lastUpdatedOn = new Date();
                            modifiedDocument.lastUpdatedBy = _params.updatedBy;


                            modifiedDocument = DateCls.convertNestedISOStringToDate(modifiedDocument);

                            const updateProp = {
                                $set: modifiedDocument
                            };

                            const promObj2 = mongodbWrapperInst.updateOne(_params.collectionName, filter, updateProp, _params.session);
                            const promObj3: Promise<CstObjectIdType> = promObj2.then(() => {
                                return modifiedDocument["_id"];
                            });

                            resolve(promObj3);
                        }
                        else {
                            let rejectMsg = `No matching ${_params.collectionName} document found for `;

                            if (filter["_id"]) {
                                rejectMsg += `id ${filter["_id"]}`;
                            }

                            if (_params.document.lastUpdatedOn) {
                                rejectMsg += ` or Data is modified by others (lastUpdatedOn ${filter["lastUpdatedOn"]} conflict )`;
                            }
                            reject(rejectMsg);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });


            }
            else {
                reject("Input params validation failed!");
            }

        });


        promObj = promObj.catch((err) => {
            LoggerCls.error("generic-database updateDocument()", err);
            throw err;
        });

        return promObj;
    }

    static insertManyDocuments(_params: IParamsInsertManyDocuments): Promise<string[]> {
        const mongodbWrapperInst = getMongodb();

        let promObj: Promise<string[]> = new Promise((resolve, reject) => {
            if (_params.collectionName && _params.documentArr instanceof Array && _params.documentArr.length) {

                for (const document of _params.documentArr) {
                    //populate common fields every document of incoming arr
                    GenericDatabaseCls.addCommonFieldsToDocument(document, _params.createdBy, false);
                    DateCls.convertNestedISOStringToDate(document);
                }

                const innerPromObj = mongodbWrapperInst.insertMany(_params.collectionName, _params.keyName, _params.documentArr, _params.session);
                resolve(innerPromObj);
            }
            else {
                reject("Input params validation failed!");
            }
        });

        promObj = promObj.catch((err) => {
            LoggerCls.error("generic-database insertManyDocuments()", err);
            throw err;
        });

        return promObj;
    }

}


export {
    GenericDatabaseCls
};

