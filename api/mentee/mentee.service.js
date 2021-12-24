const connection = require('../service-db');

const tablename = "mentee";

module.exports = {
    getAllMentee: (callback) => {
        connection.query(
            `SELECT * FROM ${tablename}`,
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    getMentee: (req, callback) => {
        connection.query(
            `SELECT * FROM ${tablename} WHERE "id_mentee" = $1`,
            [req],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    postMentee: (req, callback) => {
        connection.query(
            `INSERT INTO ${tablename} ("nama", "email", "password", "status")
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [
                req.nama,
                req.email,
                req.password,
                req.status
            ],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    getMenteeByEmail: (req, callback) => {
        connection.query(
            `SELECT * FROM ${tablename} WHERE "email" = $1`,
            [req],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        )
    }
}