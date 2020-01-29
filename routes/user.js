const express = require('express');
const router = new express.Router();
const access = require('./access');
const login = require('./userLogin');
const signup = require('./userSignup');

router.use('/login', login);
router.use('/signup', signup);
router.use('/access', access);

module.exports = router;
