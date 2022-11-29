const dbConnection = require('../db/knexfile');
const connection = require("knex")(dbConnection);

const tablename = "subject";

module.exports = {
    getAllSubject: (cb) => {
        connection(`${tablename}`)
        .select()
        .then((result) => {
            return cb(null, result);
        }).catch((error) => {
            return cb(error);
        })
    },
    getMentorbyIdSubject: (req, cb) => {
        connection(`${tablename}`)
        .select()
        .join('mentor', 'mentor.id_subject', 'subject.id')
        .where('subject.id', req)
        .then((result) => {
            return cb(null, result);
        }).catch((error) => {
            return cb(error);
        })
    }
}