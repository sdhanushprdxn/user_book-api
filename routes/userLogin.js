const express = require('express');
const router = new express.Router();
const controller = require('../controllers/userContoller');

router.use('/', controller.userLogin);

module.exports = router;
