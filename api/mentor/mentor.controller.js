const { getAllMentor, getMentor, getMentorbyEmail, postMentor, deleteMentor, updateMentor } = require('./mentor.service');
const { ERROR, SUCCESS } = require('../respon');
const { compareSync, genSaltSync, hashSync } = require('bcryptjs');
const { sign } = require('jsonwebtoken');

const salt = genSaltSync(10);

module.exports = {
    getAllMentor: (req, res) => {
        getAllMentor((error, result) => {
            if(error) return ERROR(res, 500, error);

            if(result.length == 0) return ERROR(res, 403, "no data available");
            return SUCCESS(res, 200, result);
        });
    },
    getMentor: (req, res) => {
        getMentor(req.params.id, (error, result) => {
            if(error) return ERROR(res, 500, error);
            delete result[0].password;

            if(result.length == 0) return ERROR(res, 404, "data not found");
            return SUCCESS(res, 200, result);
        });
    },
    register: (req, res) => {
        getMentorbyEmail(req.body.email, (error, result) => {
            if(error) return ERROR(res, 500, error);
            
            if(result.length > 0) return ERROR(res, 409, "Email already exist");

            req.body.password = hashSync(req.body.password, salt);
            req.body.nama = req.body.nama_depan + ' ' + req.body.nama_belakang;
            postMentor(req.body, (errors, results) => {
                if(errors) return ERROR(res, 500, errors);

                results[0]["token"] = sign({mentor: results}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "24h"});
                return SUCCESS(res, 200, results);
            });
        });
    },
    login: (req, res) => {
        getMentorbyEmail(req.body.email, (error, result) => {
            if(error) return ERROR(res, 500, error);

            if(result.length == 0) return ERROR(res, 404, "account not found or incorrect email");
            const verif = compareSync(req.body.password, result[0].password);
            if(!verif) return ERROR(res, 403, "incorrect password");

            delete result[0].password;
            result[0]["token"] = sign({mentor: result}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "24h"});
            return SUCCESS(res, 200, result);
        });
    },
    deleteAccount: (req, res) => {
        if(req.body.password == null) return ERROR(res, 403, "password is null");

        getMentor(req.params.id, (error, result) => {
            if(error) return ERROR(res, 500, error);
            if(result.length == 0) return ERROR(res, 404, "account doesn't exist");

            const verif = compareSync(req.body.password, result[0].password);
            if(!verif) return ERROR(res, 403, "incorrect password");

            deleteMentor(req.params.id, (errors, results) => {
                if(errors) return ERROR(res, 500, errors);

                return SUCCESS(res, 200, "success to delete your account");
            });
        });
    },
    updateAccount: (req, res) => {
        req.body.id = req.params.id;
        updateMentor(req.body, (error, result) => {
            if(error) return ERROR(res, 500, error);

            delete result[0].password;
            result[0]["token"] = sign({mentor: result}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "24h"});
            return SUCCESS(res, 200, result);
        });
    }
}