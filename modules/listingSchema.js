const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  name: String,
  description: String,
  location: String,
  price: Number,
  number_of_reviews: Number,
  
});

module.exports = listingSchema;