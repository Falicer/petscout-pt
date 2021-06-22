const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const expressPrettier = require('express-prettier')
const {
    ensureAuthenticated
} = require('../config/auth');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//added a delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// Opslaan van de user in de database
const userSchema = require('../schema/user.schema')
const User = mongoose.model('users', userSchema)

// Prettier always active, looks nice
router.use(
    expressPrettier({
        alwaysOn: true
    })
)

//NodeFetch()
const fetch = require('node-fetch')
const fs = require('fs')


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
    await delay(500);

    return res.render('logged-in', {
        title: 'Petscout',
        layout: '',
        css1: 'styles/main.css',
        css2: 'styles/home.css',
        users: await getUsers()
    })
})

// Aanmaken pet Edit pagina
router.get('/petEdit', async (req, res) => {
    return res.render('petCrud', {
        title: 'Petscout pet Edit',
        layout: '',
        css1: 'styles/petChange.css',
        users: await getUsers()
    })
})

// Updating user
router.post('/userCrud:id', (req, res) => {
    const buttonChoice = req.body.crud

    if (buttonChoice == "update") {
        User.findByIdAndUpdate(req.body.id, {
            pet: req.body.petChoice
        }, function (err, result) {

        })
        return res.redirect('/petEdit')
    } else if (buttonChoice == "delete") {
        User.findByIdAndDelete(req.body.id, req.body, function (err, result) {

        })
        return res.redirect('/petEdit')
    } else {

    }
})

// Aanmaken chatInlog pagina
router.get('/chatInlog', async (req, res) => {
    return res.render('chatInlog', {
        title: 'Petscout chatInlog',
        layout: '',
        css1: 'styles/chatroom.css',
        css2: ''
    })
})

// Aanmaken chatRooms pagina
router.get('/chatRooms', async (req, res) => {

    return res.render('chatRooms', {
        title: 'Petscout chatRooms',
        layout: '',
        css1: 'styles/chatroom.css',
        css2: ''
    })
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


// Registreren van user
router.post('/saveUser', (req, res) => {

    // Maak een image aan voor de user
    fetch('https://source.unsplash.com/random')
        .then(res => {
            const dest = fs.createWriteStream('./public/images/animals/' + newUser._id + 'userimage.png');
            res.body.pipe(dest);
        });

    // Maak een user variable aan met het model.
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        pet: req.body.petChoice,
        acces: "user"
    })
    // Sla het op, check als er een error is en return deze indien geval is.
    newUser.save((err) => {
        console.log(`saved ${newUser}`)
        if (err) return console.log(err)
    })

    // Redirect naar listUsers pagina.
    return res.redirect('/listUsers')
})


//FILTERS/////////////////////////////////////////////////////
//Filter op dog pagina
router.get('/matches-dog', async (req, res) => {
    // Await getUsers() omdat je anders een promise terug krijgt.
    // console.log(await getUsers())
    return res.render('matches-dog', {
        users: await findUsersDog(),
        layout: '',
        css1: 'styles/main.css',
        css2: 'styles/home.css'
    })
})

//dog filter
const findUsersDog = async (req, res) => {
    const data = await User.find({
        pet: 'dog'
    }, (error, data) => {
        if (error) {
            console.log(error)
        } else {
            console.log(data)
        }
    }).lean()
    return data
}

//Filter op cat pagina
router.get('/matches-cat', async (req, res) => {
    // Await getUsers() omdat je anders een promise terug krijgt.
    // console.log(await getUsers())
    return res.render('matches-cat', {
        users: await findUsersCat(),
        layout: '',
        css1: 'styles/main.css',
        css2: 'styles/home.css'
    })
})

//cat filter
const findUsersCat = async (req, res) => {
    const data = await User.find({
        pet: 'cat'
    }, (error, data) => {
        if (error) {
            console.log(error)
        } else {
            console.log(data)
        }
    }).lean()
    return data
}

//Filter op bird pagina
router.get('/matches-bird', async (req, res) => {
    // Await getUsers() omdat je anders een promise terug krijgt.
    // console.log(await getUsers())
    return res.render('matches-bird', {
        users: await findUsersBird(),
        layout: '',
        css1: 'styles/main.css',
        css2: 'styles/home.css'
    })
})

//cat filter
const findUsersBird = async (req, res) => {
    const data = await User.find({
        pet: 'bird'
    }, (error, data) => {
        if (error) {
            console.log(error)
        } else {
            console.log(data)
        }
    }).lean()
    return data
}

//Filter op bunny pagina
router.get('/matches-bunny', async (req, res) => {
    // Await getUsers() omdat je anders een promise terug krijgt.
    // console.log(await getUsers())
    return res.render('matches-bunny', {
        users: await findUsersBunny(),
        layout: '',
        css1: 'styles/main.css',
        css2: 'styles/home.css'
    })
})

//bunny filter
const findUsersBunny = async (req, res) => {
    const data = await User.find({
        pet: 'bunny'
    }, (error, data) => {
        if (error) {
            console.log(error)
        } else {
            console.log(data)
        }
    }).lean()
    return data
}

//Filter op bunny pagina
router.get('/matches-hamster', async (req, res) => {
    // Await getUsers() omdat je anders een promise terug krijgt.
    // console.log(await getUsers())
    return res.render('matches-hamster', {
        users: await findUsersHamster(),
        layout: '',
        css1: 'styles/main.css',
        css2: 'styles/home.css'
    })
})

//bunny filter
const findUsersHamster = async (req, res) => {
    const data = await User.find({
        pet: 'hamster'
    }, (error, data) => {
        if (error) {
            console.log(error)
        } else {
            console.log(data)
        }
    }).lean()
    return data
}
//ENDFILTERS/////////////////////////////////////////////////////

// Redirect to petCrud page
router.get('/toPetCrud', (req, res) => {
    return res.redirect('/petEdit')
})

router.post('/toUserList', (req, res) => {
    return res.redirect('/listUsers')
})

//Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Dasboard
router.get('/dashboard', ensureAuthenticated, (req, res) => { //so you can only visit dashboard if logged in
    return res.render('dashboard', {
        layout: '',
        title: 'Petscout my dasboard',
        name: req.user.name,
    })
})


router.get('/login', (req, res) => {
    return res.render('login', {
        layout: '',
        title: 'Petscout login',
    })
})

// Register
router.get('/register', (req, res) => {
    return res.render('register', {
        layout: '',
        title: 'Petscout register',
    })
})

// Register Handle
router.post('/register', (req, res) => {
    const {
        username,
        email,
        password,
        password2,
        pet
    } = req.body; //info gets taken from form  
    let errors = [];

    // Check required fields
    if (!username || !email || !password || !password2 || !pet) {
        errors.push({
            msg: 'Please fill in all fields'
        });
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({
            msg: 'Passwords do not match'
        });
    }

    // Check pass length
    if (password.length < 6) {
        errors.push({
            msg: 'Password should be at least 6 characters'
        });
    }

    if (errors.length > 0) { // so credentials stay in form when you get an error
        res.get('/register', {
            errors,
            username,
            email,
            password,
            password2,
            pet
        });
    } else {
        // Validation passed
        User.findOne({
                email: email
            }) // to find 1 user in the database and match the email
            .then(user => {
                if (user) {
                    // User exists
                    errors.push({
                        msg: 'Email is already registered'
                    });
                    res.get('/register', {
                        errors,
                        username,
                        email,
                        password,
                        password2,
                        pet
                    });
                } else { // new user made
                    const newUser = new User({
                        username,
                        email,
                        password,
                        pet
                    });

                    // Hash Password to encrypt password so password isn't shown
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => { //takes password and salt, and gives hash back
                            if (err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                                .then(user => {

                                    fetch('https://source.unsplash.com/random')
                                        .then(res => {
                                            const dest = fs.createWriteStream('./public/images/animals/' + newUser._id + 'userimage.png');
                                            res.body.pipe(dest);
                                        });

                                    req.flash('success_msg', 'You are now registered and can log in!');
                                    res.redirect('/login');
                                })
                                .catch(err => console.log(err)); //give error if it doesn't work

                        }))
                }
            });
    }

});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/listUsers',
        failureRedirect: '/login',
        failureFlash: true //succes message
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
})

module.exports = router