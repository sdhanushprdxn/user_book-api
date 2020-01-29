const express = require('express');
const router = new express.Router();
const changes = require('./changes');
const login = require('./adminLogin');
const register = require('./adminRegister');

router.use('/login', login);
router.use('/register', register);
router.use('/changes', changes);

module.exports = router;
