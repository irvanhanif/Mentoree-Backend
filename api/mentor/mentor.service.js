const connection = require('../service-db');

const tablename = "mentor";

module.exports = {
    getAllMentor: (callback) => {
        connection.query(
            `SELECT m.id_mentor, m.nama, m.email, m.password, m.alamat, 
            m.deskripsi, m.background, m.tarif, m.pendidikan, s.kategori
            FROM ${tablename} m JOIN subject s ON m.id_subject = s.id_subject`,
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    getMentor: (req, callback) => {
        connection.query(
            `SELECT m.id_mentor, m.nama, m.email, m.password, m.alamat, 
            m.deskripsi, m.background, m.tarif, m.pendidikan, s.kategori
            FROM ${tablename} m JOIN subject s ON m.id_subject = s.id_subject 
            WHERE id_mentor = $1`,
            [req],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    postMentor: (req, callback) => {
        connection.query(
            `INSERT INTO ${tablename} (nama, email, password, alamat,
            deskripsi, id_subject, background, tarif, pendidikan) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                req.nama,
                req.email,
                req.password,
                req.alamat,
                req.deskripsi,
                req.id_subject,
                req.background,
                req.tarif,
                req.pendidikan
            ],
            (error, result) => {
                if(error) return callback(error);
                
                return callback(null, result.rows);
            }
        );
    },
    getMentorWithEmail: (req, callback) => {
        connection.query(
            `SELECT m.id_mentor, m.nama, m.email, m.password, m.alamat, 
            m.deskripsi, m.background, m.tarif, m.pendidikan, s.kategori
            FROM ${tablename} m JOIN subject s ON m.id_subject = s.id_subject
            WHERE email = $1`,
            [req],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    getMentorWithIdSubject: (req, callback) => {
        connection.query(
            `SELECT m.id_mentor, m.nama, m.email, m.password, m.alamat, 
            m.deskripsi, m.background, m.tarif, m.pendidikan, s.kategori
            FROM ${tablename} m JOIN subject s ON m.id_subject = s.id_subject
            WHERE m.id_subject = $1`,
            [req],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    deleteMentor: (req, callback) => {
        connection.query(
            `DELETE FROM ${tablename} WHERE id_mentor = $1`,
            [req],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    updateMentor: (req, callback) => {
        connection.query(
            `UPDATE ${tablename} SET nama = $2, email = $3, password = $4, alamat = $5,
            deskripsi = $6, id_subject = $7, background = $8, tarif = $9, pendidikan = $10
            WHERE id_mentor = $1 RETURNING *`,
            [
                req.id_mentor,
                req.nama,
                req.email,
                req.password,
                req.alamat,
                req.deskripsi,
                req.id_subject,
                req.background,
                req.tarif,
                req.pendidikan
            ],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    }
}