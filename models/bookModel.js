const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  edition: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model('book', bookSchema);
