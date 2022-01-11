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
        const codeHash = hashSync(code, salt);
        connection.query(
            `INSERT INTO ${tablename} (nama, email, password, status, kode, active)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                req.nama,
                req.email,
                req.password,
                req.status,
                codeHash,
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
            `UPDATE ${tablename} SET nama = $2, status = $3
            WHERE id_mentee = $1 RETURNING *`,
            [
                req.id_mentee,
                req.nama,
                req.status
            ],
            (error, result) => {
                if(error) return callback(error);

                return callback(null, result.rows);
            }
        );
    },
    verifAccount: (req, callback) => {
        const data = sign({mentee: req, active: true}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "20m"});
        const option = {
            from: '"No-Reply Mentoree" <mentoree123@gmail.com>',
            to: req.email,
            subject: "Activate Account",
            html: `<h4>hello, ${req.nama}...<h4><br><br>
            
            <h4>you have been completed form to create account, and then you can activate your account with input code which are we share to you or just click link and your account is active.<h4><br>
            <h4>here is your code <b>${req.code}<b><h4><br> 
            <h4>or you can click this link before 20 minutes for activate your account<br> link/${data}<h4>`
        };

        transporter.sendMail(option, (error, result) => {
            if(error) return callback(error);

            return callback(null, result.response);
        });
    },
    forgotPassword: (req, callback) => {
        let code = '';
        for(let i = 0 ; i < 4 ; i++){
            code += Math.round(Math.random()*9);
        }
        const codeHash = hashSync(code, salt);

        const data = sign({mentee: req, active: true}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "20m"});
        const option = {
            from: '"No-Reply Mentoree" <mentoree123@gmail.com>',
            to: req.email,
            subject: "Forgot Password",
            html: `<h4>here is your code <b>${code}<b><h4><br> 
            <h4>or you can click this link before 20 minutes for activate your account<br> link/${data}<h4>`
        };
        connection.query(
            `UPDATE ${tablename} SET kode = $2 WHERE id_mentee = $1 RETURNING *`,
            [
                req.id_mentee,
                codeHash
            ],
            (error, result) => {
                if(error) return callback(error);

                transporter.sendMail(option, (errors, results) => {
                    if(errors) return callback(errors);

                    if(results.response.length == 0) return ERROR(res, 500, "Something wrong when send email");
                    return callback(null, req);
                });
            }
        );
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
    },
    resendToken: (req, callback) => {
        let code = '';
        for(let i = 0 ; i < 4 ; i++){
            code += Math.round(Math.random()*9);
        }
        const codeHash = hashSync(code, salt);

        connection.query(
            `UPDATE ${tablename} SET kode = $2 WHERE id_mentee = $1 RETURNING *`,
            [
                req.id_mentee,
                codeHash
            ],
            (error, result) => {
                if(error) return callback(error);
                
                const data = sign({mentee: req, active: true}, process.env.KEYAPP, {algorithm: "HS256", expiresIn: "20m"});
                const option = {
                    from: '"No-Reply Mentoree" <mentoree123@gmail.com>',
                    to: req.email,
                    subject: "Activate Account",
                    html: `<h4>hello, ${req.nama}...<h4><br><br>
                    
                    <h4>you have been completed form to create account, and then you can activate your account with input code which are we share to you or just click link and your account is active.<h4><br>
                    <h4>here is your code <b>${code}<b><h4><br> 
                    <h4>or you can click this link before 20 minutes for activate your account<br> link/${data}<h4>`
                };
                transporter.sendMail(option, (errors, results) => {
                    if(errors) return callback(errors);

                    if(results.response.length == 0) return ERROR(res, 500, "Something wrong when send email");
                    return callback(null, req);
                });
            }
        );
    },
    updatePassword: (req, callback) => {
        connection.query(
            `UPDATE ${tablename} SET password = $2 WHERE id_mentee = $1`,
            [
                req.id_mentee,
                req.password
            ]
        )
    }
}