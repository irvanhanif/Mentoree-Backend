const express = require('express');
const router = express.Router();

const { getAllSubject } = require('./subject.controller');

router.get('/', getAllSubject);

module.exports = router;