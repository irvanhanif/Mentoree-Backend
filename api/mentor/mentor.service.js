const connection = require('../service-db');

const tablename = "mentor";

module.exports = {
    getAllMentor: (callback) => {
        connection.query(
            `SELECT * FROM ${tablename}`,
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    getMentor: (req, res) => {
        connection.query(
            `SELECT * FROM ${tablename} WHERE "id_mentor" = $1`,
            [req],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    postMentor: (req, res) => {
        connection.query(
            `INSERT INTO ${tablename} ("nama", "email", "password", "alamat",
            "pekerjaan", "id_subject", "background", "tarif") VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
                req.nama,
                req.email,
                req.password,
                req.alamat,
                req.pekerjaan,
                req.id_subject,
                req.background,
                req.tarif
            ],
            (error, result) => {
                if(error) return callback(error);
                
                return callback(null, result.rows);
            }
        );
    },
    getMentorWithEmail: (req, callback) => {
        connection.query(
            `SELECT * FROM ${tablename} WHERE "email" = $1`,
            [req],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    }
}