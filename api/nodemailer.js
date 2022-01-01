const { createTransport } = require('nodemailer');

const transporter = createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSEMAIL
    },
    tls: true
});

module.exports = transporter;