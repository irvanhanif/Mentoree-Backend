const { 
    getAllMentee, getMentee, postMentee, getMenteeByEmail, 
    deleteMentee, updateMentee, forgotPassword, verifAccount,
    ActivateAccount 
} = require('./mentee.service');
const { ERROR, SUCCESS } = require('../respon');
const { compareSync, genSaltSync, hashSync } = require('bcryptjs');
const {sign} = require('jsonwebtoken');
const cache = require('../cache');

const salt = genSaltSync(10);

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
            console.log(result)
            if(result.length > 0) return ERROR(res, 409, "Email already exist");
            req.body.password = hashSync(req.body.password, salt);
            postMentee(req.body, (errors, results) => {
                if(errors) return ERROR(res, 500, errors);
    
                delete results[0].password;
                if(!results[0]) return ERROR(res, 403, "Account does'nt record");
                verifAccount(results[0], (errors1, results1) => {
                    if(errors1) return ERROR(res, 500, errors1);

                    if(results1.length == 0) return ERROR(res, 500, "Something wrong when send email");
                    return SUCCESS(res, 200, results);
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
            result[0]["token"] = sign({mentee: result}, "HS256", {expiresIn: "60m"});
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
        if(req.body.data.kode != req.body.kode) return ERROR(res, 500, "Code is incorrect");

        ActivateAccount(req.body.data.id_mentee, (error, result) => {
            if(error) return ERROR(res, 500, error);

            const data = req.body.data;
            data[0]["token"] = sign({mentee: data}, "HS256", {expiresIn: "60m"});
            return SUCCESS(res, 200, data);
        })
    },
    inputToken: (req, res) => {
        let token = req.params.token;
        if(!token) return ERROR(res, 500, "Access Denied");

        token = token.slice(7);
        verify(token, "HS256", (error, decoded) => {
            if(error) return ERROR(res, 500, error);
            if(!decoded.id_mentee) return ERROR(res, 500, "Account is not Mentee");

            ActivateAccount(decoded.id_mentee, (error, result) => {
                if(error) return ERROR(res, 500, error);

                getMentee(decoded.id_mentee, (error, result) => {
                    result[0]["token"] = sign({mentee: result}, "HS256", {expiresIn: "60m"});
                    return SUCCESS(res, 200, result);
                });
            });
        });
    }
}