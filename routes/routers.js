const express = require('express');
const router = express.routers();
const admin = require('./');
const user = require('./');

router.use('/admin', admin);
router.use('/user', user);

module.exports = router;
