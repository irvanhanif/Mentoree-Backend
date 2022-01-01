const { verify } = require('jsonwebtoken');
const { ERROR } = require('./respon');

module.exports = {
    accountToken: (req, res, next) => {
        let token = req.get("authorization");
        if(!token) return ERROR(res, 500, "Access Denied");
        
        token = token.slice(7);
        verify(token, "HS256", (error, decoded) => {
            if(error) return ERROR(res, 500, error);
            if(!decoded.mentor.id_mentor || !decoded.mentee.id_mentee) return ERROR(res, 500, "Account is not Mentor or Mentee");
            
            req.decoded = decoded;
            next();
        });
    },
    mentorToken: (req, res, next) => {
        if(!req.decoded.mentor.id_mentor) return ERROR(res, 500, "Account is not Mentor");

        next();
    },
    menteeToken: (req, res, next) => {
        if(!req.decoded.mentee.id_mentee) return ERROR(res, 500, "Account is not Mentee");
        
        next();
    }
}