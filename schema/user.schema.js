const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = new Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  pet: {type: String, required: true}
})

module.exports = user;