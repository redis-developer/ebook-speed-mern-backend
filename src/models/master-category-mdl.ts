import type { CstDocumentType } from "../utils/mongodb/generic-database.types";


interface IMasterCategory extends CstDocumentType {
    category: string;
    code: string;
    name: string;
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

