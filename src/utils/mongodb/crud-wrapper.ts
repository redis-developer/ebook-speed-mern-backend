import type {
    CstObjectIdType,
} from "../../dependencies";

import { ObjectId } from "../../dependencies";

const convertStringToObjectId = (_id: CstObjectIdType): CstObjectIdType => {
    const regexItem = /^[a-f\d]{24}$/i;

    if (_id && typeof _id == "string" && regexItem.test(_id)) {
        _id = new ObjectId(_id);
    }
    return _id;
};

const convertStringArrToObjectIdArr = (_ids: CstObjectIdType[]): CstObjectIdType[] => {

    if (_ids && _ids.length) {
        _ids = Array.from(_ids, (elm) => {
            return convertStringToObjectId(elm);
        });
    }

    return _ids;
};


