const express = require('express');
const router = express.Router();

const { getAllMentor, getMentor, register, login, deleteAccount, updateAccount } = require('./mentor.controller');

router.get('/', getAllMentor);
router.get('/:id', getMentor);
router.post('/register', register);
router.post('/login', login);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

module.exports = router;