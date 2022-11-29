const dbConnection = require('../db/knexfile');
const connection = require("knex")(dbConnection);

const tablename = "mentee";

module.exports = {
    getAllMentee: (cb) => {
        connection(`${tablename}`)
        .select()
        .then((result) => {
            return cb(null, result);
        }).catch((error) => {
            return cb(error);
        })
    },
    getMentee: (req, cb) => {
        connection(`${tablename}`)
        .where('id', req)
        .select()
        .then((result) => {
            return cb(null, result);
        }).catch((error) => {
            return cb(error);
        })
    },
    postMentee: (req, cb) => {
        connection(`${tablename}`)
        .insert({
            nama: req.nama, 
            email: req.email, 
            password: req.password, 
            status: req.status, 
        }).returning('*')
        .then((result) => {
            return cb(null, result);
        }).catch((error) => {
            return cb(error);
        })
    },
    getMenteeByEmail: (req, cb) => {
        connection(`${tablename}`)
        .where('email', req)
        .select()
        .then((result) => {
            return cb(null, result);
        }).catch((error) => {
            return cb(error);
        })
    },
    deleteMentee: (req, cb) => {
        connection(`${tablename}`)
        .where('id', req)
        .del()
        .then((result) => {
            return cb(null, result);
        }).catch((error) => {
            return cb(error);
        })
    },
    updateMentee: (req, cb) => {
        connection(`${tablename}`)
        .where('id', req.id)
        .update({
            nama : req.nama,
            status : req.status
        }).returning('*')
        .then((result) => {
            return cb(null, result);
        }).catch((error) => {
            return cb(error);
        })
    },
    
}