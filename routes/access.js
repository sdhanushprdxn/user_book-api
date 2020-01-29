const express = require('express');
const router = new express.Router();
const controller = require('../controllers/userContoller');
const verify = require('../util/tokenVerify');

router.get('/allusers', verify, controller.otherUsers);
router.get('/books', verify, controller.books);
router.get('/specificUser/:email', verify, controller.user);
router.get('/book/:bookName', verify, controller.book);

module.exports = router;
