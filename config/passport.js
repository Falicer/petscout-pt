const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');   // to see if email, password etc matches
const bcrypt = require('bcryptjs');     // to decrypt the hash, so password matches

// Load User Model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {      //email is username to login
            // Match User
            User.findOne({ email: email}) //to see if there is an email that matches in the database
            .then(user => {
                if(!user) { //no match, return error message
                    return done(null, false, { message: 'That email is not registered'});
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {  //compare the normal, and hashed password
                    if(err) throw err;

                    if(isMatch) { //user passed succesfully
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            })
            .catch(err => console.log(err));
        })
    );


//Usually credentials will only be transmitted during login request. If authentication succeeds a session wil be
// established and maintained via a cookie. Each subsequent request will not contain credentials
// but the unique cookie that identifies the session. In order to support login sessions
// Passport will serialize and deserialize user instasnces to and from the session
passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}