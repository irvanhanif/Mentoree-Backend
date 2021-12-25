const express = require('express');
const router = express.Router();

const { getAllMentor, getMentor, register, login } = require('./mentor.controller');

router.get('/', getAllMentor);
router.get('/:id', getMentor);
router.post('/register', register);
router.post('/login', login);

module.exports = router;