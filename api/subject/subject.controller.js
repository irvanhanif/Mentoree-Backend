const { getAllSubject } = require('./subject.service');
const { SUCCESS, ERROR } = require('../respon');

module.exports = {
    getAllSubject: (req, res) => {
        getAllSubject((error, result) => {
            if(error) return ERROR(res, 500, error);

            return SUCCESS(res, 200, result);
        })
    }
}