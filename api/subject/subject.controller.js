const { getAllSubject } = require('./subject.service');
const { getMentorWithIdSubject } = require('../mentor/mentor.service');
const { SUCCESS, ERROR } = require('../respon');

module.exports = {
    getAllSubject: (req, res) => {
        getAllSubject((error, result) => {
            if(error) return ERROR(res, 500, error);

            if(result.length == 0) return ERROR(res, 403, "no data available");
            return SUCCESS(res, 200, result);
        });
    },
    getMentorWithSubject: (req, res) => {
        getMentorWithIdSubject(req.params.id, (error, result) => {
            if(error) return ERROR(res, 500, error);

            if(result.length == 0) return ERROR(res, 403, "no data available");
            return SUCCESS(res, 200, result);
        })
    }
}