const express = require('express');
const router = express.Router();

const { 
    getAllMentee, getMentee, register, login, deleteAccount, updateAccount,
    forgotPassword, inputCode, inputToken
} = require('./mentee.controller');
const { accountToken, menteeToken } = require('../middleware');

router.get('/', getAllMentee);
router.get('/:id', accountToken, menteeToken, getMentee);
router.post('/register', register);
router.post('/register/kode', inputCode);
router.post('/register/token/:token', inputToken)
router.post('/login', login);
router.post('/forgotpw', forgotPassword);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

module.exports = router;