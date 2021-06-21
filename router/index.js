const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Dasboard
router.get('/dashboard', ensureAuthenticated, (req, res) => { //so you can only visit dashboard if logged in
    return res.render('dashboard', {
      layout: 'dashboard',
      title: 'Petscout my dasboard',
      name: req.user.name,
    })
  })

module.exports = router;