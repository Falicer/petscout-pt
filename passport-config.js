//Alle functies van passport staan hier
const express = require('express')
const router = express.Router()
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const passport = require('passport')  //authenticatie voor passwords

function initialize(passport, getUserByEmail, getUserById) { //functie om te laten zien of gebruiker correcte gegevens invoerd
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {  //vergelijkt ingevoerde password met bcrypt password
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) { //error
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))   //zodat gegevens in de sessie worden bewaard
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize