const db = require("../connect");

const queryHandler = async (q, success = null, failure = null) => {
    try {
        const result = await db.query(q);
        if(success) {
            success(result);
        } else {
            return result;
        }
    } catch (error) {
        console.error(error);
        //console.log(error);
        if(failure) {
            failure(error);
        } else {
            throw error;
        }
    }
}

module.exports = { queryHandler };