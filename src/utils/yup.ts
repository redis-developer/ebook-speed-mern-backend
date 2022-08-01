
class YupCls {
    static async validateSchema(_data: unknown, _schema: unknown): Promise<unknown> {

        if (_data && _schema) {
            //@ts-ignore 
            _data = await _schema
                .validate(_data, { //validate 
                    strict: false,
                    stripUnknown: true //remove unknown properties
                })
                //@ts-ignore 
                .catch((err) => {
                    if (err) {
                        const trimmedError = {
                            name: err.name,
                            details: err.errors
                        };
                        throw trimmedError;
                    }
                });

            //@ts-ignore
            _data = _schema.cast(_data); //string to date/ number..etc safe type casting
        }

        return _data;
    }
}

export {
    YupCls
};