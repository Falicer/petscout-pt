require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const handlebars = require('express-handlebars')
const app = express();

// Maakt een port uit 3000 of het gegeven port van je host, vergeet niet je IP door te geven voor de database
const PORT = process.env.PORT || 3000

//Passport config
require('./config/passport')(passport);

  // Maak een verbinding met mongodb via mongoose
const connectDBMongoose = require('./config/mongoose.js')
connectDBMongoose()

//Including socket.io
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Socket.io setup, imports events module and use those in io.on
const events = require('./modules/ioEvents');
io.on('connection', (socket) => {
  events.ioEvents(socket, io);
});

// Zet hbs als templating engine
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({
  extended: true
}))

// Set custom templating engine
app.engine('hbs', handlebars({
  layoutsDir: `${__dirname}/views`,
  extname: 'hbs',
  defaultLayout: '',
  partialsDir: `${__dirname}/views/partials`
}))

app.use(express.static('public')) 
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Bodyparser (voor data van formulier met req.body)
app.use(express.urlencoded({ extended: false}));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Passport middleware / initializing the local strategy of passport
app.use(passport.initialize()); 
app.use(passport.session());

// Connect flash
app.use(flash());

// // Global Variabels (for error messages)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Render page
const routes = require('./router/router.js')
app.use('/', routes)


// Luisteren of localhost actief is
http.listen(PORT, () => {
  console.log(`Hammering at http://localhost:${PORT}`)
})