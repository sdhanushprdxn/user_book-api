const express = require('express');
const router = express.routers();
const controller = require('../controllers/controller');

router.use('/', controller.userSignup);

module.exports = router;
