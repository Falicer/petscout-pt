const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const handlebars = require('express-handlebars')
const app = express();

//Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// //EJS
// app.set('view engine', 'ejs');

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
  defaultLayout: 'welcome',
  partialsDir: `${__dirname}/views/partials`
}))

app.use(express.static('public')) 
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Bodyparser
app.use(express.urlencoded({ extended: false}));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// // Global Variabels
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Routes
app.use('/', require('./router/index'));
app.use('/users', require('./router/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port ${PORT}'));