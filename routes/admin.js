const express = require('express');
const router = new express.Router();
const controller = require('../controllers/adminController');
const verify = require('../util/tokenVerify');

router.use('/login', controller.adminLogin);
router.use('/register', controller.adminRegister);
router.post('/newbook', verify, controller.newBook);
router.put('/updatebookdetails', verify, controller.updateBook);
router.delete('/deletebook/:bookname', verify, controller.deleteBook);
router.delete('/deleteuser/:email', verify, controller.deleteUser);
router.get('/allusers', verify, controller.otherUsers);
router.get('/books', verify, controller.books);
router.get('/specificUser/:email', verify, controller.user);
router.get('/book/:bookName', verify, controller.book);

module.exports = router;
