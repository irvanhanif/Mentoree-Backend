const { 
    getAllMentee, getMentee, postMentee, getMenteeByEmail, 
    deleteMentee, updateMentee, forgotPassword, verifAccount,
    ActivateAccount 
} = require('./mentee.service');
const { ERROR, SUCCESS } = require('../respon');
const { compareSync, genSaltSync, hashSync } = require('bcryptjs');
const {sign, verify} = require('jsonwebtoken');

const salt = genSaltSync(10);

module.exports = {
    getAllMentee: (req, res) => {
        getAllMentee((errors, results) => {
            if(errors) return ERROR(res, 500, errors);
        
            if(results.length == 0) return ERROR(res, 403, "no data available");
            for(let i = 0; i < results.length; i++) {
                delete results[i].password;
                delete results[i].kode;
            }
            return SUCCESS(res, 200, results);
        });
    },
    getMentee: (req, res) => {
        getMentee(req.params.id, (error, result) => {
            if(error) return ERROR(res, 500, error);
    
            if(result.length == 0) return ERROR(res, 404, "data not found");
            delete result[0].password;
            delete result[0].kode;
            return SUCCESS(res, 200, result);
        });
    },
    register: (req, res) => {
        getMenteeByEmail(req.body.email, (error, result) => {
            if(error) return ERROR(res, 500, error);
            
            if(result.length > 0) return ERROR(res, 409, "Email already exist");
            req.body.password = hashSync(req.body.password, salt);
            postMentee(req.body, (errors, results) => {
                if(errors) return ERROR(res, 500, errors);
                console.log('post '+results)
                delete results[0].password;
                if(!results[0]) return ERROR(res, 403, "Account does'nt record");
                verifAccount(results[0], (errors1, results1) => {
                    if(errors1) return ERROR(res, 500, errors1);
                    console.log('verif '+results1)
                    if(results1.length == 0) return ERROR(res, 500, "Something wrong when send email");
                    
                    results[0]["token"] = sign({mentee: result}, process.env.KEY, {algorithm: "HS256", expiresIn: "24h"});
                    return SUCCESS(res, 200, result);
                })
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
            result[0]["token"] = sign({mentee: result}, process.env.KEY, {algorithm: "HS256", expiresIn: "24h"});
            return SUCCESS(res, 200, result);
        });
    },
    deleteAccount: (req, res) => {
        getMentee(req.params.id, (error, result) => {
            if(error) return ERROR(res, 500, error);
            if(result.length == 0) return ERROR(res, 404, "account doesn't exist");

            deleteMentee(req.params.id, (errors, results) => {
                if(errors) return ERROR(res, 500, errors);
                if(results.length == 0) return ERROR(res, 403, "something wrong, try again")
                
                return SUCCESS(res, 200, "account has been deleted");
            });
        });
    },
    updateAccount: (req, res) => {
        req.body.id = req.params.id;
        updateMentee(req.body, (error, result) => {
            if(error) return ERROR(res, 500, error);

            return SUCCESS(res, 200, result);
        });
    },
    forgotPassword: (req, res) => {
        forgotPassword(req.body, (error, result) => {
            if(error) return ERROR(res, 500, error);

            return SUCCESS(res, 200, result);
        });
    },
    inputCode: (req, res) => {
        let token = req.get("authorization");
        token = token.slice(7);
        verify(token, process.env.KEY, {algorithms: "HS256"}, (error, decoded) => {
            if(error) return ERROR(res, 500, error);
            console.log('decoded '+decoded)
            const verif = compareSync(req.body.kode, decoded.mentee[0].code);
            if(!verif) return ERROR(res, 500, "Code is incorrect");
            
            ActivateAccount(decoded.mentee[0].id_mentee, (errors, result) => {
                if(errors) return ERROR(res, 500, errors);
                console.log(result)
                if(!result) return ERROR(res, 500, "Something wrong when activate accoung");
                getMentee(req.body.id_mentee, (errors1, results) => {
                    if(errors1) return ERROR(res, 500, errors1);

                    delete results[0].password;
                    delete results[0].kode;
                    results[0]["token"] = sign({mentee: results}, process.env.KEY, {algorithm: "HS256", expiresIn: "24h"});
                    return SUCCESS(res, 200, results);
                });
            });    
        });
    },
    inputToken: (req, res) => {
        const token = req.params.token;
        verify(token, process.env.KEY, {algorithms: "HS256"}, (error, decoded) => {
            if(error) return ERROR(res, 500, error);
            console.log('decoded '+decoded)
            if(!decoded[0].id_mentee) return ERROR(res, 500, "Account is not Mentee");
            ActivateAccount(decoded[0].id_mentee, (errors, results) => {
                if(errors) return ERROR(res, 500, errors);
                console.log('active '+results)
                if(!results) return ERROR(res, 500, "Something wrong when activate accoung");
                getMentee(decoded[0].id_mentee, (errors1, results1) => {
                    if(errors1) return ERROR(res, 500, errors1);

                    delete results[0].password;
                    delete results[0].kode;
                    results1[0]["token"] = sign({mentee: results1}, process.env.KEY, {algorithm: "HS256", expiresIn: "24h"});
                    return SUCCESS(res, 200, results1);
                });
            });
        });
    }
}