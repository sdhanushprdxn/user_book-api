const userModel = require('../models/userModel');
// const bookModel = require('../models/bookModel');
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
  userLogin: (req, res) => {}
};
