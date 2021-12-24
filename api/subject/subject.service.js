const connection = require('../service-db');

const tablename = "subject";

module.exports = {
    getAllSubject: (callback) => {
        connection.query(
            `SELECT * FROM ${tablename}`,
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    }
}