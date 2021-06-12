const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const expressPrettier = require('express-prettier')

// Opslaan van de user in de database
const userSchema = require('../schema/user.schema')
const User = mongoose.model('users', userSchema)

router.use(
  expressPrettier({
    alwaysOn: true
  })
)

// Renderen van main iirc
router.get('/', (req, res) => {
  return res.render('index', {
    title: 'Main test page',
    layout: 'index'
  })
})

// functie die de users ophaalt, door middel van mongoose model.find
// en een async functie omdat de applicatie op data moet wachten.
// Wanneer data terug is, return deze
const getUsers = async () => {
  const data = await User.find().lean()
  return data
}


// Route voor de pagina waar je data ophaalt.
// de object heeft een variable genaamd users die uiteindelijk een object of array van users heeft.
// Data haal je asynchroon (async await) op anders krijg je een promise terug
router.get('/listUsers', async (req, res) => {
  // Await getUsers() omdat je anders een promise terug krijgt.
  console.log(await getUsers())


  return res.render('testlijst', {
    title: 'Petscout Users',
    layout: 'index',
    users: await getUsers()
  })
})

// Aanmaken pet Edit pagina
router.get('/petEdit', async (req, res) => {
  return res.render('petCrud', {
    title: 'Petscout pet Edit',
    layout: 'index',
    css: 'petChange.css',
    users: await getUsers()
  })
})

// Aanmaken chatInlog pagina
router.get('/chatInlog', async (req, res) => {
  return res.render('chatInlog', {
    title: 'Petscout chatInlog',
    layout: 'index',
    css: 'chatroom.css',
  })
})

// Aanmaken chatRooms pagina
router.get('/chatRooms', async (req, res) => {

  return res.render('chatRooms', {
    title: 'Petscout chatRooms',
    layout: 'index',
    css: 'chatroom.css',
  })
})

// Registreren van user
router.post('/saveUser', (req, res) => {

  // Maak een user variable aan met het model.
  let newUser = new User({
    username: req.body.username,
    email: req.body.name,
    password: req.body.password,
    pet: req.body.petChoice,
    acces: "user"
  })
  // Sla het op, check als er een error is en return deze indien geval is.
  newUser.save((err) => {
    console.log(`saved ${newUser}`)
    if (err) return handleError(err)
  })

  // return res.render('testlijst', { //stuurt je naar een andere pagina, nvm ben dom
  //   title: 'Hmmm, does this work?',
  //   layout: 'index'
  // })

  // Redirect naar listUsers pagina.
  return res.redirect('/listUsers')
})

// Redirect to petCrud page
router.get('/toPetCrud', (req, res) => {
  return res.redirect('/petEdit')
})

// Updating user pet
router.post('/updateUser:id', (req, res) => {
  var userID = req.params.id

  User.findByIdAndUpdate(req.body.id, {pet: req.body.petChoice}, function(err, result){
      
  })
  return res.redirect('/petEdit')
})

// Redirect naar chatInlog pagina
router.get('/toChat', (req, res) => {
  return res.redirect('/chatInlog')
})

// Redirect naar chatRooms geeft username mee
router.post('/tochatroom', (req, res) => {
  console.log(req.body)


  return res.redirect(`/chatRooms?username=${req.body.username}&room=${req.body.room}`)
})


module.exports = router