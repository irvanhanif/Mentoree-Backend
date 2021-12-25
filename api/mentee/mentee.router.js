const express = require('express');
const router = express.Router();

const { getAllMentee, getMentee, register, login } = require('./mentee.controller');

router.get('/', getAllMentee);
router.get('/:id', getMentee);
router.post('/register', register);
router.post('/login', login);

module.exports = router;