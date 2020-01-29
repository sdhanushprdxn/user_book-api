const express = require('express');
const router = new express.Router();
const controller = require('../controllers/adminController');

router.use('/', controller.adminRegister);

module.exports = router;
