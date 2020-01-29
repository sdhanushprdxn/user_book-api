const express = require('express');
const router = express.routers();
const access = require('./access');
const login = require('./userLogin');
const signup = require('./userSignup');

router.use('/login', login);
router.use('/register', signup);
router.use('/changes', access);

module.exports = router;
