const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

// Opslaan van de user in de database
const userSchema = require('../schema/user.schema')
const User = mongoose.model('users', userSchema)

// Registratie stuff
const flash = require('express-flash') //geeft berichten wanneer email of bijv. wachtwoord verkeerd is
const session = require('express-session') //zodat data van gebruiker op meerdere pagina's te gebruiken is
const bcrypt = require('bcrypt')      //secure passwords met hashpasswords
const passport = require('passport')  //authenticatie voor passwords
const methodOverride = require('method-override')
let bodyParser = require('body-parser')

router.use(flash())
router.use(session({
  secret: process.env.SESSION_SECRET,   ///.env opvragen zodat code veilig is
  resave: false,                        //niet resaven als niks veranderd is
  saveUninitialized: false
}))


router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))

require('../passport-config')(passport);

const initializePassport = require('../passport-config')    //passport functie oproepen
initializePassport(

  data = User.find().lean(),

  passport,
  email => data.find(user => user.email === email), //user vinden gebaseerd op email
  id => data.find(user => user.id === id),
)

//functions
function checkAuthenticated(req, res, next) {   //als user authenticated is, verder gaan
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {  //als user niet authenticated is, terug naar index
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

// Renderen van main iirc
// router.get('/', (req, res) => {
//   return res.render('index',
//     {
//       title: 'Hmmm, does this work?',
//       layout: 'index'
//     })
// })

router.post('/register', checkNotAuthenticated, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  // users.push({
  //   id: Date.now().toString(),
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: hashedPassword
  // })

  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    pet: req.body.petChoice,
    acces: "user"
  })

  // Sla het op, check als er een error is en return deze indien geval is.
  newUser.save((err) => {
    console.log(`saved ${newUser}`)
    if (err) return handleError(err)
  })

  res.redirect('/login')      //als account maken gelukt is, gebruiker doorverwijzen naar login
})

//Routes
router.get('/', checkAuthenticated, (req, res) => {
  return res.render('index', {
    layout: 'index',
    name: req.user.name
  })
})

router.get('/login', checkNotAuthenticated, (req, res) => {
  return res.render('login', {
    layout: 'login'
  })
})

router.get('/register', checkNotAuthenticated, (req, res) => {
  return res.render('register', {
    layout: 'register'
  })
})

//Post
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/')
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  req.session = null
  res.redirect('/')
})



module.exports = router