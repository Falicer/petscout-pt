const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Dasboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    return res.render('dashboard', {
      layout: 'dashboard',
      title: 'Petscout my dasboard',
      name: req.user.name,
    })
  })

// router.get('/dashboard', ensureAuthenticated, (req, res) => 
// res.render('dashboard', {
//     name: req.user.name
// }));


module.exports = router;