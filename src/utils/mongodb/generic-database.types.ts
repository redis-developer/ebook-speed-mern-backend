import type {
    //mongodb
    Filter, Document, Sort, ClientSession,
    CstObjectIdType

} from "../../dependencies";

import { ObjectId } from "../../dependencies";

enum DEFAULT_LIMIT {
    FIND_DOCUMENTS = 10000
}

enum DB_ROW_STATUS {
    ACTIVE = 1,
    INACTIVE = 0,
    TO_BE_PURGED = -1
}

interface ICommonFields {
    _id?: ObjectId | 1 | 0 | string;
    createdOn?: string | Date; // date/ ISO string
    createdBy?: string;
    lastUpdatedOn?: string | Date | null;
    lastUpdatedBy?: string | null;
    statusCode?: DB_ROW_STATUS;
    others?: { //optional dynamic other fields
        [k: string]: unknown;
    };
    [k: string]: unknown;
}

type CstDocumentType = Document & ICommonFields;

interface IParamsInsertDocument {
    collectionName: string;
    keyName: string;
    document: CstDocumentType;
    createdBy: string;
    session?: ClientSession;
}

interface IParamsGetDocuments {
    collectionName: string;
    keyName: string;
    createdBy?: string;
    filter?: Filter<Document>;
    sort?: Sort;
    projection?: CstDocumentType;
    limit?: number;
}

interface IParamsUpdateDocumentById {
    id: CstObjectIdType;
    collectionName: string;
    keyName: string;
    document: CstDocumentType;
    updatedBy: string;
    session?: ClientSession;
    isReplaceFlatArray?: boolean;
    flatArrayProps?: CstDocumentType;
}

interface IParamsInsertManyDocuments {
    requestId?: string;
    collectionName: string;
    keyName: string;
    documentArr: CstDocumentType[];
    createdBy: string;
    session?: ClientSession;
}

interface IParamsAggregate {
    collectionName: string;
    pipelineArr: Document[];
    isInitializePipelineArr: boolean;
}

export {
    DB_ROW_STATUS,
    DEFAULT_LIMIT,

    CstDocumentType,

    IParamsInsertDocument,
    IParamsGetDocuments,
    IParamsUpdateDocumentById,
    IParamsInsertManyDocuments,
    IParamsAggregate
};