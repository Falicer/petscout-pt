require('dotenv').config()
const express = require('express')
const app = express()
// Maakt een port uit 3000 of het gegeven port van je host, vergeet niet je IP door te geven voor de database
const PORT  = process.env.PORT || 3000
const handlebars = require('express-handlebars')

// Zet hbs als templating engine
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true}))

// Set custom templating engine
app.engine('hbs', handlebars({
     layoutsDir: `${__dirname}/views/layout`,
     extname: 'hbs',
     defaultLayout: 'index',
     partialsDir: `${__dirname}/views/partials`
}))


// Maak een verbinding met mongodb via mongoose
const connectDBMongoose = require('./config/mongoose')
connectDBMongoose()

// Render page
const routes =  require('./router/router.js')
app.use('/', routes)

// Luisteren of localhost actief is
app.listen(PORT, () => {
  console.log(`Hammering at http://localhost:${PORT}`)
})

