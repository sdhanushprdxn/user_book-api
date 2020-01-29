const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/otherusers', controller.otherUsers);
router.get('/books', controller.books);
router.get('/user/:name', controller.user);
router.get('/book/:bookName', controller.book);

module.exports = router;
