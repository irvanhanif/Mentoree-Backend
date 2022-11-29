const { getAllSubject, getMentorbyIdSubject } = require('./subject.service');
const { SUCCESS, ERROR } = require('../respon');

module.exports = {
    getAllSubject: (req, res) => {
        getAllSubject((error, result) => {
            if(error) return ERROR(res, 500, error);

            if(result.length == 0) return ERROR(res, 403, "no data available");
            return SUCCESS(res, 200, result);
        });
    },
    getMentorbySubject: (req, res) => {
        getMentorbyIdSubject(req.params.id, (error, result) => {
            if(error) return ERROR(res, 500, error);
            if(result.length == 0) return ERROR(res, 403, "no data available");

            result.forEach(account => {
                delete account.password;
            });
            return SUCCESS(res, 200, result);
        })
    }
}