const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  pet: { type: String, required: true },
  created: { type: Date, default: Date.now },
  acces: { type: String }
})

module.exports = user;