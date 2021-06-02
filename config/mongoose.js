const mongoose = require('mongoose');

// Connectie maken naar MongoDB
const connectDBMongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONN_STRING, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    // Connectie werkt!
    console.log('connected to the database 👌🎶')
  } catch (error) {
    // Connectie failed
    console.log(`ERROR needs a fix: ${error}`)
    throw error
  }
}

module.exports = connectDBMongoose