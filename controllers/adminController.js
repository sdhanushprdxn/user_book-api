const adminModel = require('../models/adminModel');
const bookModel = require('../models/bookModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const Joi = require('@hapi/joi');
const saltRounds = 10;

const validateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required(),
  email: Joi.string()
    .min(6)
    .required()
    .email(),
  password: Joi.string()
    .alphanum()
    .min(6)
    .required(),
  city: Joi.string()
    .min(3)
    .required(),
  contact: Joi.number()
    .min(10)
    .required()
});

const validateBookSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required(),
  author: Joi.string()
    .min(6)
    .required(),
  edition: Joi.string()
    .alphanum()
    .min(6)
    .required(),
  type: Joi.string()
    .min(3)
    .required(),
  price: Joi.number()
    .min(1)
    .required()
});

dotenv.config();

module.exports = {
  //create a new admin
  adminRegister: (req, res) => {
    // validate request data
    const { error } = validateSchema.validate({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      city: req.body.city,
      contact: req.body.contact
    });
    if (error)
      return res.status(400).json({ result: error.details[0].message });

    adminModel
      .findOne({ email: req.body.email })
      .exec()
      .then(user => {
        if (user) {
          return res.status(409).json({
            message: 'User already exits',
            suggestion: 'Try with different emailId'
          });
        } else {
          //hash the password
          bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if (err) {
              return res.status(500).json({ error: err });
            } else {
              let user = new adminModel({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                city: req.body.city,
                contact: req.body.contact
              });
              //save to database
              user
                .save()
                .then(result => {
                  res.json({
                    status: 'successfully Signed Up',
                    username: result.name
                  });
                })
                .catch(err => {
                  res.status(500).json({ success: false, result: `${err}` });
                });
            }
          });
        }
      });
  },
  // admin login
  adminLogin: (req, res) => {
    adminModel
      .findOne({ email: req.body.email })
      .exec()
      .then(user => {
        if (user) {
          bcrypt.compare(req.body.password, user.password, (err, feed) => {
            if (feed) {
              //creating token for sucessful login
              const token = jwt.sign(
                {
                  email: user.email,
                  userId: user._id
                },
                process.env.ACCESS_SECRET_KEY,
                {
                  expiresIn: '1h'
                }
              );
              return res.header('auth-token', token).json({
                status: 'Logged in as Admin',
                message: `Welcome ${user.name}`
              });
            }
            if (err) {
              return res.status(500).json({ message: 'login failed' });
            }
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'Log in failed',
          result: 'Invalid Username Password Combination'
        });
      });
  },
  //add new book
  newBook: (req, res) => {
    // validate request data
    const { error } = validateBookSchema.validate({
      name: req.body.name,
      author: req.body.author,
      edition: req.body.edition,
      type: req.body.type,
      price: req.body.price
    });
    if (error)
      return res.status(400).json({ result: error.details[0].message });
    bookModel
      .findOne({ name: req.body.name })
      .exec()
      .then(result => {
        if (result) {
          return res.status(409).json({
            message: 'Book already exits',
            suggestion: 'Try with different Name'
          });
        } else {
          let book = new bookModel({
            name: req.body.name,
            author: req.body.author,
            edition: req.body.edition,
            type: req.body.type,
            price: req.body.price
          });
          //save to database
          book
            .save()
            .then(result => {
              res.json({
                status: 'successfully added',
                bookName: result.name
              });
            })
            .catch(err => {
              res.status(500).json({ success: false, result: `${err}` });
            });
        }
      });
  },
  //get all books
  books: (req, res) => {
    bookModel
      .find({}, { _id: 0, __v: 0 })
      .exec()
      .then(books => {
        res.json(books);
      })
      .catch(err => {
        res.send({ error: err });
      });
  },
  //single book search by name
  book: (req, res) => {
    bookModel
      .findOne({ name: req.params.bookName })
      .exec()
      .then(book => {
        if (book) return res.json(book);
        res.status(404).json({ message: 'Book not found' });
      })
      .catch(err => {
        res.json({ error: err });
      });
  },
  //update book details
  updateBook: (req, res) => {
    bookModel
      .findOneAndUpdate({ name: req.body.name }, req.body, {
        useFindAndModify: false,
        new: true
      })
      .then(update => {
        if (update) return res.send({ status: 'updated!' });
        res
          .status(404)
          .send({ status: 'update fail', message: 'enter correct name' });
      })
      .catch(err => {
        res.status(404).send({ status: 'update fail', message: err });
      });
  },
  //get other usersdetails
  otherUsers: (req, res) => {
    userModel
      .find({}, { password: 0, _id: 0, __v: 0 })
      .exec()
      .then(users => {
        res.json(users);
      })
      .catch(err => {
        res.json({ error: err });
      });
  },
  // get specific users
  user: (req, res) => {
    userModel
      .findOne(
        { email: req.params.email },
        { email: 0, password: 0, _id: 0, __v: 0 }
      )
      .exec()
      .then(user => {
        if (user) return res.json(user);
        res.status(404).json({ message: 'user not found' });
      })
      .catch(err => {
        res.json({ error: err });
      });
  },
  deleteBook: (req, res) => {
    bookModel
      .deleteOne({ name: req.params.bookname })
      .then(deleted => {
        if (deleted.deletedCount === 1)
          return res.send({ status: 'successfully deleted' });
        res.status(404).send({ status: 'fail', message: 'enter correct name' });
      })
      .catch(err => {
        res.json({ error: err });
      });
  },
  deleteUser: (req, res) => {
    userModel
      .deleteOne({ email: req.params.email })
      .then(deleted => {
        if (deleted.deletedCount === 1)
          return res.send({ status: 'successfully deleted' });
        res.status(404).send({ status: 'fail', message: 'enter correct name' });
      })
      .catch(err => {
        res.json({ error: err });
      });
  }
};
