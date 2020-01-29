const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.post('/newbook', controller.newBook);
router.delete('/deletebook/:bookname', controller.deleteBook);
router.post('/updatebookdetails', controller.updateBook);
router.post('/deleteuser', controller.deleteUser);

module.exports = router;
