const { response } = require('express');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User')

// Login
router.get('/login', (req, res) => {
    return res.render('login', {
      layout: 'login',
      title: 'Petscout login',
    })
  })

// Register
router.get('/register', (req, res) => {
    return res.render('register', {
      layout: 'register',
      title: 'Petscout register',
    })
  })

// Register Handle
router.post('/register', (req, res) => {
   const { name, email, password, password2 } = req.body;   //info gets taken from form  
   let errors = [];

   // Check required fields
   if(!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
   }

   // Check passwords match
   if(password !== password2) {
       errors.push({ msg: 'Passwords do not match'});
   }

   // Check pass length
   if(password.length < 6) {
       errors.push({ msg: 'Password should be at least 6 characters' });
   }

   if(errors.length > 0) {           // so credentials stay in form when you get an error
    res.render('register', {
        errors,
        name,
        email,
        password,
        password2
    });
   } else {
       // Validation passed
    User.findOne({ email: email})    // to find 1 user in the database and match the email
     .then(user => {
         if (user) {
             // User exists
             errors.push({ msg: 'Email is already registered'});
             res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            });
         } else {                   // new user made
            const newUser = new User({
                name,
                email,
                password
            });

            // Hash Password to encrypt password so password isn't shown
            bcrypt.genSalt(10, (err, salt) =>
             bcrypt.hash(newUser.password, salt, (err, hash) => {       //takes password and salt, and gives hash back
                if(err) throw err;
                // Set password to hashed
                newUser.password = hash;
                // Save user
                newUser.save()
                 .then(user => {
                     req.flash('success_msg', 'You are now registered and can log in!');
                     res.redirect('/users/login');
                 })
                 .catch(err => console.log(err)); //give error if it doesn't work

            }))
         }
     });
   }

});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true //succes message
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})


module.exports = router;