const { 
    getAllMentee, getMentee, postMentee, getMenteeByEmail, 
    deleteMentee, updateMentee, forgotPassword, verifAccount 
} = require('./mentee.service');
const { ERROR, SUCCESS } = require('../respon');
const { compareSync, genSaltSync, hashSync } = require('bcryptjs');
const {sign} = require('jsonwebtoken');
const cache = require('../cache');

const salt = genSaltSync(10);

module.exports = {
    getAllMentee: (req, res) => {
        if(cache.get('mentee')){
            return SUCCESS(res, 200, cache.get('mentee'));
        }else{
            getAllMentee((errors, results) => {
                if(errors) return ERROR(res, 500, errors);
        
                if(results.length == 0) return ERROR(res, 403, "no data available");
                for(let i = 0; i < results.length; i++) {
                    delete results[i].password;
                }
                cache.set('mentee', results);
                return SUCCESS(res, 200, results);
            });
        }
    },
    getMentee: (req, res) => {
        if(cache.get('mentee')){
            const data = cache.get('mentee');
            for(let i = 0; i < data.length; i++){
                if(data[i].id_mentee == req.params.id){
                    const subdata = [];
                    subdata.push(data[i]);
                    cache.set('mentee', data);
                    return SUCCESS(res, 200, subdata);
                }
            }
        }else{
            getMentee(req.params.id, (error, result) => {
                if(error) return ERROR(res, 500, error);
    
                if(result.length == 0) return ERROR(res, 404, "data not found");
                delete result[0].password;
                return SUCCESS(res, 200, result);
            });
        }
    },
    register: (req, res) => {
        getMenteeByEmail(req.body.email, (error, result) => {
            if(error) return ERROR(res, 500, error);
            console.log(result)
            if(result.length > 0) return ERROR(res, 409, "Email already exist");
            req.body.password = hashSync(req.body.password, salt);
            postMentee(req.body, (errors, results) => {
                if(errors) return ERROR(res, 500, errors);
    
                // delete results[0].password;
                // results[0]["token"] = sign({mentee: results}, "HS256", {expiresIn: "60m"});
                // return SUCCESS(res, 200, results);
                if(!results[0]) return ERROR(res, 403, "Account does'nt record");
                getAllMentee((errors1, results1) => {
                    if(errors1) return ERROR(res, 500, errors1);
            
                    for(let i = 0; i < results1.length; i++) {
                        delete results1[i].password;
                    }
                    cache.set('mentee', results1);
                });
                verifAccount(results[0], (errors2, results2) => {
                    if(errors2) return ERROR(res, 500, errors2);

                    return SUCCESS(res, 200, results2);
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
    }
}