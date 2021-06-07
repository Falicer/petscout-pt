const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')


// Opslaan van de user in de database
const userSchema = require('../schema/user.schema')
const User = mongoose.model('users', userSchema)


// Renderen van main iirc
router.get('/', (req, res) => {
  return res.render('index', 
  {
    title: 'Hmmm, does this work?',
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
    title: 'userlist',
    layout: 'index',
    users: await getUsers()
  })
})


// Registreren van user
router.post('/saveUser', (req, res) => {

  // Maak een user variable aan met het model.
  let newUser = new User({
    name: req.body.name, 
    password: req.body.password, 
    pet: req.body.petChoice,
    acces: "user"
  })
  // Sla het op, check als er een error is en return deze indien geval is.
  newUser.save((err) => {
    console.log(`saved ${newUser}`)
    if(err) return handleError(err)
  })

  // return res.render('testlijst', { //stuurt je naar een andere pagina, nvm ben dom
  //   title: 'Hmmm, does this work?',
  //   layout: 'index'
  // })

  // Redirect naar listUsers pagina.
  return res.redirect('/listUsers')
})

module.exports = router