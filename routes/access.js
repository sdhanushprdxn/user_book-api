const express = require('express');
const router = new express.Router();
const controller = require('../controllers/userContoller');

router.get('/otherusers', controller.otherUsers);
router.get('/books', controller.books);
router.get('/user/:name', controller.user);
router.get('/book/:bookName', controller.book);

module.exports = router;
