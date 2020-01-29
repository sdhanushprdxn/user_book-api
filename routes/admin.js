const express = require('express');
const router = express.routers();
const login = require('./');
const register = require('./');
const changes = require('./');

router.use('/login', login);
router.use('/register', register);
router.use('/changes', changes);

module.exports = router;
