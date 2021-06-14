if (process.env.NODE_ENV !== 'production') { //zet alle data in .env zodat het veilig staat
  require('dotenv').config()
}

const express = require('express')
const app = express()
// Maakt een port uit 3000 of het gegeven port van je host, vergeet niet je IP door te geven voor de database
const PORT = process.env.PORT || 3000
const handlebars = require('express-handlebars')

const users = []    //users in lokaal variabel inplaats van database

// Zet hbs als templating engine
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
// app.set('views', 'views')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: false }))



// Set custom templating engine
app.engine('hbs', handlebars({
  layoutsDir: `${__dirname}/views`,
  extname: 'hbs',
  defaultLayout: 'index',
  partialsDir: `${__dirname}/views`
}))

// Maak een verbinding met mongodb via mongoose
const connectDBMongoose = require('./config/mongoose')
connectDBMongoose()

// Render page
const routes = require('./router/router.js')
app.use('/', routes)

//404 error
app.use(function (req, res, next) {
  res.status(404).send('Error 404! Deze pagina bestaat niet!');
});

// Luisteren of localhost actief is
app.listen(PORT, () => {
  console.log(`Hammering at http://localhost:${PORT}`)
})
