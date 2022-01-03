const connection = require('../service-db');
const transporter = require('../nodemailer');
const { sign } = require('jsonwebtoken');
const { hashSync, genSaltSync } = require('bcryptjs');

const tablename = "mentee";
const salt = genSaltSync(10);

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
        code = hashSync(code, salt);
        connection.query(
            `INSERT INTO ${tablename} (nama, email, password, status, kode, active)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                req.nama,
                req.email,
                req.password,
                req.status,
                code,
                false
            ],
            (error, result) => {
                if(error) return callback(error);

                result = result.rows;
                result[0].code = code;
                return callback(null, result);
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
        const data = sign(req, process.env.KEY, {algorithm: "HS256", expiresIn: "20m"});
        const option = {
            from: '"No-Reply Mentoree" <mentoree123@gmail.com>',
            to: req.email,
            subject: "Activate Account",
            html: `hello, ${req.nama}...<br><br> you have been completed form to create account, and then you can activate your account with input code which are we share to you or just click link and your account is active.<br>
            here is your code <b>${req.code}<b> <br> or you can click this link before 20 minutes for activate your account<br> link/${data}`
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
    },
    ActivateAccount: (req, callback) => {
        connection.query(
            `UPDATE ${tablename} SET active = $2 WHERE id_mentee = $1 RETURNING *`,
            [
                req,
                true
            ],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    }
}