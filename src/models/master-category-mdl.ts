import type { CstDocumentType } from "../utils/mongodb/generic-database.types";


interface IMasterCategory extends CstDocumentType {
    category: string;
    code: string;
    name: string;
    statusCode: number;
}


/** 
const sample = {
        category: "COUNTRY",
        code: "AUSTRALIA",
        name: "Australia"
    };
*/

export type {
    IMasterCategory
};

