const dbConnection = require('../db/knexfile');
const connection = require("knex")(dbConnection);

const tablename = "mentor";

module.exports = {
    getAllMentor: (cb) => {
        connection(`${tablename}`)
        .select()
        .join('subject', 'mentor.id_subject', 'subject.id')
        .then((result) => {
            for (const account in result) {
                delete account.password;
            }
            return cb(null, result);
        }).catch((error) => {
            return cb(error);
        })
    },
    getMentor: (req, cb) => {
        connection(`${tablename}`)
        .select()
        .join('subject', 'mentor.id_subject', 'subject.id')
        .where('mentor.id', req)
        .then((result) => {
            return cb(null, result);
        }).catch((error) => {
            return cb(error);
        })
    },
    postMentor: (req, cb) => {
        connection(`${tablename}`)
        .insert({
            nama: req.nama, 
            email: req.email, 
            password: req.password, 
            alamat: req.alamat,
            deskripsi: req.deskripsi,
            id_subject: req.id_subject,
            background: req.background,
            tarif: req.tarif,
            pendidikan: req.pendidikan
        }).returning('*')
        .then( (result) => {
            connection(`${tablename}`)
            .select()
            .join('subject', 'mentor.id_subject', 'subject.id')
            .where('mentor.id', result[0].id)
            .then((result) => {
                delete result[0].password;
                return cb(null, result);
            }).catch((error) => {
                return cb(error);
            })
        }).catch((error) => {
            return cb(error);
        })
    },
    getMentorbyEmail: (req, cb) => {
        connection(`${tablename}`)
        .select()
        .join('subject', 'mentor.id_subject', 'subject.id')
        .where('mentor.email', req)
        .then((result) => {
            return cb(null, result);
        }).catch((error) => {
            return cb(error);
        })
    },
    deleteMentor: (req, cb) => {
        connection(`${tablename}`)
        .del()
        .where('id', req)
        .then((result) => {
            return cb(null, result);
        }).catch((error) => {
            return cb(error);
        })
    },
    updateMentor: (req, cb) => {
        connection(`${tablename}`)
        .update({
            nama: req.nama, 
            alamat: req.alamat,
            deskripsi: req.deskripsi,
            id_subject: req.id_subject,
            background: req.background,
            tarif: req.tarif,
            pendidikan: req.pendidikan
        }).returning('*')
        .then( (result) => {
            connection(`${tablename}`)
            .select()
            .join('subject', 'mentor.id_subject', 'subject.id')
            .where('mentor.id', result[0].id)
            .then((result) => {
                delete result[0].password;
                return cb(null, result);
            }).catch((error) => {
                return cb(error);
            })
        }).catch((error) => {
            return cb(error);
        })
    }
}