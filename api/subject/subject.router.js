const express = require('express');
const router = express.Router();

const { getAllSubject, getMentorWithSubject } = require('./subject.controller');

router.get('/', getAllSubject);
router.get('/mentor/:id', getMentorWithSubject);

module.exports = router;