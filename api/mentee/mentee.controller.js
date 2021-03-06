const { 
    getAllMentee, getMentee, postMentee, getMenteeByEmail, 
    deleteMentee, updateMentee, forgotPassword, verifAccount,
    ActivateAccount, resendToken
} = require('./mentee.service');
const { ERROR, SUCCESS } = require('../respon');
const { compareSync, genSaltSync, hashSync } = require('bcryptjs');
const {sign, verify} = require('jsonwebtoken');

const salt = genSaltSync(10);
let token = '';

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
        if(req.decoded.mentee[0].id_mentee != req.params.id) return ERROR(res, 403, "id request doesnt match with id mentee");
        
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
                
                delete results[0].password;
                if(!results[0]) return ERROR(res, 403, "Account does'nt record");
                verifAccount(results[0], (errors1, results1) => {
                    if(errors1) return ERROR(res, 500, errors1);
                    
                    if(results1.length == 0) return ERROR(res, 500, "Something wrong when send email");
                    
                    token = sign({mentee: results}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "20m"});
                    const tokens = sign({id: results[0].id_mentee, token: token}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "24h"});
                    return SUCCESS(res, 200, {token: tokens});
                });
            });
        });
    },
    login: (req, res) => {
        getMenteeByEmail(req.body.email, (error, result) => {
            if(error) return ERROR(res, 500, error);
            
            if(result.length == 0) return ERROR(res, 404, "account not found or incorrect email");
            if(!result[0].active) return ERROR(res, 500, "account isn't active");
            const verif = compareSync(req.body.password, result[0].password);
            if(!verif) return ERROR(res, 403, "incorrect password");

            delete result[0].password;
            delete result[0].kode;
            token = sign({mentee: result}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "24h"});
            return SUCCESS(res, 200, {token: token});
        });
    },
    deleteAccount: (req, res) => {
        if(req.decoded.mentee[0].id_mentee != req.params.id) return ERROR(res, 403, "id request doesnt match with id mentee");

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
        if(req.decoded.mentee[0].id_mentee != req.params.id) return ERROR(res, 403, "id request doesnt match with id mentee");

        req.body.id_mentee = req.params.id;
        updateMentee(req.body, (error, result) => {
            if(error) return ERROR(res, 500, error);
            
            getMentee(result[0].id_mentee, (errors, results) => {
                if(errors) return ERROR(res, 500, errors)
                
                delete result[0].password;
                delete result[0].kode;
                token = sign({mentee: results}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "24h"});
                return SUCCESS(res, 200, {token: token});
            });
        });
    },
    forgotPassword: (req, res) => {
        getMenteeByEmail(req.body.email, (error, result) => {
            if(error) return ERROR(res, 500, error);

            if(result.length == 0) return ERROR(res, 404, "account not found or incorrect email");
            delete result[0].password;
            delete result[0].kode;
            forgotPassword(result[0], (errors, results) => {
                if(errors) return ERROR(res, 500, errors);

                token = sign({mentee: result}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "24h"});
                return SUCCESS(res, 200, {token: token});
            });
        });
    },
    inputCode: (req, res) => {
        let tokens = req.get("authorization");
        tokens = tokens.slice(7);
        
        verify(tokens, process.env.KEYAPP, {algorithms: "HS256"}, (error, decoded) => {
            if(error) return ERROR(res, 500, error);
            
            verify(decoded.token, process.env.KEYAPP, {algorithms: "HS256"}, (errors, decodeds) => {
                if(errors) return ERROR(res, 500, errors);
                
                const verif = compareSync(req.body.kode, decodeds.mentee[0].kode);
                if(!verif) return ERROR(res, 500, "Code is incorrect");
                ActivateAccount(decodeds.mentee[0].id_mentee, (errors2, results) => {
                    if(errors2) return ERROR(res, 500, errors2);
    
                    if(!results) return ERROR(res, 500, "Something wrong when activate accoung");
                    getMentee(results[0].id_mentee, (errors3, results1) => {
                        if(errors3) return ERROR(res, 500, errors3);
        
                        delete results1[0].password;
                        delete results1[0].kode;
                        token = sign({mentee: results1}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "24h"});
                        return SUCCESS(res, 200, {data: results1, token: token});
                    });
                });
            }); 
        });
    },
    inputToken: (req, res) => {
        const tokens = req.params.token;
        verify(tokens, process.env.KEYAPP, {algorithms: "HS256"}, (error, decoded) => {
            if(error) return ERROR(res, 500, error);
            
            if(!decoded.mentee.id_mentee) return ERROR(res, 500, "Account is not Mentee");
            if(!decoded.active) return ERROR(res, 500, "Not from mentoree API");
            ActivateAccount(decoded.mentee.id_mentee, (errors, results) => {
                if(errors) return ERROR(res, 500, errors);
                
                if(!results) return ERROR(res, 500, "Something wrong when activate accoung");
                getMentee(decoded.mentee.id_mentee, (errors1, results1) => {
                    if(errors1) return ERROR(res, 500, errors1);

                    delete results1[0].password;
                    delete results1[0].kode;
                    token = sign({mentee: results1}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "24h"});
                    return SUCCESS(res, 200, {data: results1, token: token});
                });
            });
        });
    },
    resendKodeToken: (req, res) => {
        let tokens = req.get("authorization");
        tokens = tokens.slice(7);
        verify(tokens, process.env.KEYAPP, {algorithms: "HS256"}, (error, decoded) => {
            if(error) return ERROR(res, 500, error);

            getMentee(decoded.id, (errors, result) => {
                if(errors) return ERROR(res, 500, errors);

                delete result[0].password;
                delete result[0].kode;
                resendToken(result, (errors1, results) => {
                    if(errors1) return ERROR(res, 500, errors1);
                    
                    token = sign({mentee: results}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "20m"});
                    const tokens = sign({id: result[0].id_mentee, token: token}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "24h"});
                    return SUCCESS(res, 200, {token: tokens});
                });
            });
        });
    },
    inputNewPassword: (req, res) => {
        const password = hashSync(req.body.password, salt);
        updateMentee(req.body)
    }
}