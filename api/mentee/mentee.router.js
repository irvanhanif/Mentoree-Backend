const express = require('express');
const router = express.Router();

const { getAllMentee, register, login } = require('./mentee.controller');

router.get('/', getAllMentee);
router.post('/register', register);
router.post('/login', login);

module.exports = router;