const mongoose = require('mongoose')
const Schema = mongoose.Schema

// User schema, met de datum gecreeerd en acces level voor admin privilegs etc.
const user = new Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  pet: {type: String, required: true},
  created: {type: Date, default: Date.now},
  acces: {type: String}
})

module.exports = user;