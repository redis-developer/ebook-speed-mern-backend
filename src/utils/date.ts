import type {
    //mongodb
    Document

} from "../dependencies";

class DateCls {

    static convertISOStringToDate(_dateStr: string): Date | null {
        let retDate = null;
        if (typeof (_dateStr) == "string" && _dateStr.match("\\d{4}-[01]\\d-[0-3]\\dT*")) { //Note point 1
            retDate = new Date(_dateStr);
        }

        return retDate;
    }

    static convertNestedISOStringToDate(_obj: Document): Document {
        if (_obj && typeof _obj == "object") {
            for (const key in _obj) {
                const checkVal = _obj[key];
                if (typeof (checkVal) == "string") {
                    const retVal = DateCls.convertISOStringToDate(checkVal);
                    if (retVal) {
                        _obj[key] = retVal;
                    }
                } else if (Array.isArray(checkVal)) {
                    for (const arrObj of checkVal) {
                        DateCls.convertNestedISOStringToDate(arrObj);
                    }
                } else if (typeof (checkVal) == "object") {
                    DateCls.convertNestedISOStringToDate(checkVal);
                }
            }
        }
        return _obj;
    }



}


export {
    DateCls
};

/*
Notes:
1) Regex explanation:
    - Checking 4 digits for year, then a '-'.
    - For month, first digit should start with either 0 or 1, then any 2nd digit, then a '-'
    - For date, first digit should be between 0 and 3, then any 2nd digit, then T and anything.
 */