const express = require('express');
const router = express.Router();

const { 
    getAllMentee, getMentee, register, login, deleteAccount, updateAccount,
    forgotPassword 
} = require('./mentee.controller');

router.get('/', getAllMentee);
router.get('/:id', getMentee);
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpw', forgotPassword);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

module.exports = router;