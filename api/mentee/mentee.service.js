const connection = require('../service-db');
const transporter = require('../nodemailer');
const { sign } = require('jsonwebtoken');

const tablename = "mentee";

module.exports = {
    getAllMentee: (callback) => {
        connection.query(
            `SELECT * FROM ${tablename}`,
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    getMentee: (req, callback) => {
        connection.query(
            `SELECT * FROM ${tablename} WHERE id_mentee = $1`,
            [req],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    postMentee: (req, callback) => {
        let code = '';
        for(let i = 0 ; i < 4 ; i++){
            code += Math.round(Math.random()*9);
        }
        console.log(code)
        connection.query(
            `INSERT INTO ${tablename} (nama, email, password, status, kode)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
                req.nama,
                req.email,
                req.password,
                req.status,
                code
            ],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    getMenteeByEmail: (req, callback) => {
        connection.query(
            `SELECT * FROM ${tablename} WHERE email = $1`,
            [req],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    deleteMentee: (req, callback) => {
        connection.query(
            `DELETE FROM ${tablename} WHERE id_mentee = $1 RETURNING *`,
            [req],
            (error, result) => {
                if(error) return callback(error);
                
                return callback(null, result.rows);
            }
        );
    },
    updateMentee: (req, callback) => {
        connection.query(
            `UPDATE ${tablename} SET nama = $2, email = $3, password = $4, status = $5
            WHERE id_mentee = $1 RETURNING *`,
            [
                req.id_mentee,
                req.nama,
                req.email,
                req.password,
                req.status
            ],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    verifAccount: (req, callback) => {
        console.log(req)
        const data = sign({id_mentee: req.id_mentee, active: true}, "HS256", {expiresIn: "20m"});
        const option = {
            from: '"No-Reply Mentoree" <mentoree123@gmail.com>',
            to: req.email,
            subject: "Activate Account",
            html: `hello, ${req.nama}... you have been completed form to create account, and then you can activate your account with input code which are we share to you or just click link and your account is active.<br>
            here is your code ${req.kode} <br> or you can click this link for activate your account<br> link/${data}`
        };

        transporter.sendMail(option, (error, result) => {
            if(error) return callback(error);

            return callback(null, result.response);
        });
    },
    forgotPassword: (req, callback) => {
        const option = {
            from: '"No-Reply Mentoree" <mentoree123@gmail.com>',
            to: req.email,
            subject: "Forgot Password",
            html: "ini kodemu ... <br>harap input sebelum 20 menit"
        };

        transporter.sendMail(option, (error, result) => {
            if(error) return callback(error);

            return callback(null, result.response);
        });
    }
}