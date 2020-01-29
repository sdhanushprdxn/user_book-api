const userModel = require('../models/userModel');
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

dotenv.config();

module.exports = {
  //create a new user
  userSignup: (req, res) => {
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

    userModel
      .findOne({ email: req.body.email })
      .exec()
      .then(user => {
        if (user) {
          res.status(409).json({
            message: 'User already exits',
            suggestion: 'Try with different emailId'
          });
        } else {
          //hash the password
          bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if (err) {
              return res.status(500).json({ error: err });
            } else {
              let user = new userModel({
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
  //user login
  userLogin: (req, res) => {
    userModel
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
                status: 'Logged In',
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
  // get other users details
  otherUsers: (req, res) => {
    userModel
      .find({}, { email: 0, password: 0, _id: 0, __v: 0 })
      .exec()
      .then(users => {
        res.json(users);
      })
      .catch(err => {
        res.json({ error: err });
      });
  },
  //send all books data
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
  //search specific user by email
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
  }
};
