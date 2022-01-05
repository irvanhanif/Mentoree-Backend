const { verify } = require('jsonwebtoken');
const { ERROR } = require('./respon');

module.exports = {
    accountToken: (req, res, next) => {
        let token = req.get("authorization");
        if(!token) return ERROR(res, 500, "Access Denied");
        
        token = token.slice(7);
        verify(token, process.env.KEYAPP, {algorithms: "HS256"}, (error, decoded) => {
            if(error) return ERROR(res, 500, error);
            
            if(!(decoded.mentor || decoded.mentee)) return ERROR(res, 500, "Account is not Mentor or Mentee");
            
            req.decoded = decoded;
            next();
        });
    },
    mentorToken: (req, res, next) => {
        if(!req.decoded.mentor[0].id_mentor) return ERROR(res, 500, "Account is not Mentor");

        next();
    },
    menteeToken: (req, res, next) => {
        if(!req.decoded.mentee[0].id_mentee) return ERROR(res, 500, "Account is not Mentee");
        
        next();
    }
}