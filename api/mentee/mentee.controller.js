const { getAllMentee, getMentee, postMentee, getMenteeByEmail } = require('./mentee.service');
const { ERROR, SUCCESS } = require('../respon');
const { compareSync, genSaltSync, hashSync } = require('bcryptjs');
const {sign} = require('jsonwebtoken');

const salt = genSaltSync(10);

module.exports = {
    getAllMentee: (req, res) => {
        getAllMentee((error, result) => {
            if(error) return ERROR(res, 500, error);

            if(result.length == 0) return ERROR(res, 403, "no data available");
            for(let i = 0; i < result.length; i++) {
                delete result[i].password;
            }
            return SUCCESS(res, 200, result);
        });
    },
    getMentee: (req, res) => {
        getMentee(req.params.id, (error, result) => {
            if(error) return ERROR(res, 500, error);

            console.log(result)
            if(result.length == 0) return ERROR(res, 404, "data not found");
            delete result[0].password;
            return SUCCESS(res, 200, result);
        });
    },
    register: (req, res) => {
        req.body.password = hashSync(req.body.password, salt);
        postMentee(req.body, (error, result) => {
            if(error) return ERROR(res, 500, error);

            delete result[0].password;
            result[0]["token"] = sign({mentee: result}, "HS256", {expiresIn: "60m"});
            return SUCCESS(res, 200, result);
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
    }
}