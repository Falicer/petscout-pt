const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const user = require('../schema/user.schema')


// Opslaan van de user in de database
const userSchema = require('../schema/user.schema')
const User = mongoose.model('users', userSchema)

  //NodeFetch()
const fetch = require('node-fetch')
const fs = require('fs')


// Renderen van main iirc
router.get('/', (req, res) => {
  return res.render('index', 
  {
    title: 'Hmmm, does this work?',
    layout: 'index',
    css:'form.css'
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
  // console.log(await getUsers())
  
  return res.render('logged-in', {
    title: 'userlist',
    layout: 'index',
    css:'home.css',
    users: await getUsers()
  })
})

// Registreren van user
router.post('/saveUser', (req, res) => {

  // Maak een image aan voor de user
    fetch('https://source.unsplash.com/random')
    .then(res => {
        const dest = fs.createWriteStream('./public/images/animals/' + newUser._id + 'userimage.png');
        res.body.pipe(dest);
    });

  // Maak een user variable aan met het model.
  const newUser = new User({
    name: req.body.name, 
    password: req.body.password, 
    pet: req.body.petChoice
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



//Filter op hond
router.get('/matches', async (req, res) => {
  // Await getUsers() omdat je anders een promise terug krijgt.
  // console.log(await getUsers())
  return res.render('matches', {
    users: await findUsers()
  })
})

//hond filter
const findUsers = async (req, res) => {
  const data = await User.find({pet: 'Bunny'}, (error, data) => {
    if(error){
      console.log(error)
    }else{
      console.log(data)
    }
  }).lean()
  return data
}

module.exports = router