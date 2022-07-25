import type {
    Document
} from "../dependencies";

import { lodashGroup } from "../dependencies";


class LodashCls {

    static merge(destinationObj: Document, ...sourceObjects: Document[]): Document {

        return lodashGroup.merge(destinationObj, ...sourceObjects);
    }
    static isEqual(Obj1: Document, obj2: Document): boolean {
        return lodashGroup.isEqual(Obj1, obj2);
    }

}

export {
    LodashCls
};