const { 
    getAllMentee, getMentee, postMentee, getMenteeByEmail, 
    deleteMentee, updateMentee
} = require('./mentee.service');
const { ERROR, SUCCESS } = require('../respon');
const { compareSync, genSaltSync, hashSync } = require('bcryptjs');
const {sign} = require('jsonwebtoken');

const salt = genSaltSync(10);
let token = '';

module.exports = {
    getAllMentee: (req, res) => {
        getAllMentee((errors, results) => {
            if(errors) return ERROR(res, 500, errors);
        
            if(results.length == 0) return ERROR(res, 403, "no data available");
            for(let i = 0; i < results.length; i++) {
                delete results[i].password;
            }
            return SUCCESS(res, 200, results);
        });
    },
    getMentee: (req, res) => {
        if(req.decoded.mentee[0].id != req.params.id) return ERROR(res, 403, "id request doesnt match with id mentee");
        
        getMentee(req.params.id, (error, result) => {
            if(error) return ERROR(res, 500, error);
    
            if(result.length == 0) return ERROR(res, 404, "data not found");
            delete result[0].password;
            return SUCCESS(res, 200, result);
        });
    },
    register: (req, res) => {
        getMenteeByEmail(req.body.email, (error, result) => {
            if(error) return ERROR(res, 500, error);
            
            if(result.length > 0) return ERROR(res, 409, "Email already exist");
            req.body.password = hashSync(req.body.password, salt);
            req.body.nama = req.body.nama_depan + ' ' + req.body.nama_belakang;
            postMentee(req.body, (errors, results) => {
                if(errors) return ERROR(res, 500, errors);
                
                delete results[0].password;
                if(!results[0]) return ERROR(res, 403, "Account does'nt record");
                    
                const token = sign({id: results[0].id}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "24h"});
                return SUCCESS(res, 200, {data: results[0], token: token});
            });
        });
    },
    login: (req, res) => {
        getMenteeByEmail(req.body.email, (error, result) => {
            if(error) return ERROR(res, 500, error);
            
            if(result.length == 0) return ERROR(res, 404, "account not found or incorrect email");
            const verif = compareSync(req.body.password, result[0].password);
            if(!verif) return ERROR(res, 403, "incorrect password");

            delete result[0].password;
            token = sign({mentee: result}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "24h"});
            return SUCCESS(res, 200, {data: result, token: token});
        });
    },
    deleteAccount: (req, res) => {
        if(req.decoded.mentee[0].id != req.params.id) return ERROR(res, 403, "id request doesnt match with id mentee");
        if(req.body.password == null) return ERROR(res, 403, "password is null");
        
        getMentee(req.params.id, (error, result) => {
            if(error) return ERROR(res, 500, error);
            if(result.length == 0) return ERROR(res, 404, "account doesn't exist");

            const verif = compareSync(req.body.password, result[0].password);
            if(!verif) return ERROR(res, 403, "incorrect password");
            
            deleteMentee(req.params.id, (errors, results) => {
                if(errors) return ERROR(res, 500, errors);
                if(results.length == 0) return ERROR(res, 403, "something wrong, try again")
                
                return SUCCESS(res, 200, "account has been deleted");
            });
        });
    },
    updateAccount: (req, res) => {
        if(req.decoded.mentee[0].id != req.params.id) return ERROR(res, 403, "id request doesnt match with id mentee");

        req.body.id = req.params.id;
        updateMentee(req.body, (error, result) => {
            if(error) return ERROR(res, 500, error);
            
            getMentee(result[0].id, (errors, results) => {
                if(errors) return ERROR(res, 500, errors)
                
                delete results[0].password;
                token = sign({mentee: results}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "24h"});
                return SUCCESS(res, 200, {token: token});
            });
        });
    }
}