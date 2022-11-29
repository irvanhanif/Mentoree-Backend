const express = require('express');
const router = express.Router();

const { getAllSubject, getMentorbySubject } = require('./subject.controller');

router.get('/', getAllSubject);
router.get('/mentor/:id', getMentorbySubject);

module.exports = router;