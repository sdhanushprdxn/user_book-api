const express = require('express');
const router = new express.Router();
const controller = require('../controllers/adminController');

router.use('/', controller.adminLogin);

module.exports = router;
