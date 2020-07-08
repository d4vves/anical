/*----- Required NPM Libraries -----*/
require('dotenv').config()
const Express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const helmet = require('helmet')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/ppConfig')
const db = require('./models')
const isLoggedIn = require('./middleware/isLoggedIn')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const axios = require('axios')

/*----- app Setup -----*/
const app = Express()
app.use(Express.urlencoded({ extended: false }))
app.use(Express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(require('morgan')('dev'))
app.use(helmet())

const sessionStore = new SequelizeStore({
    db: db.sequelize,
    expiration: 1000 * 60 * 30
})

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}))

sessionStore.sync()

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
    res.locals.alerts = req.flash()
    res.locals.currentUser = req.user
    next()
})

/*----- Routes -----*/
app.get('/', (req, res) => {
    axios.get('http://api.jikan.moe/v3/schedule')
    .then((response) => {
        let resData = response.data
        res.render('index', {
            monday: resData.monday,
            tuesday: resData.tuesday,
            wednesday: resData.wednesday,
            thursday: resData.thursday,
            friday: resData.friday,
            saturday: resData.saturday,
            sunday: resData.sunday
        })
    }).catch(err => {
        console.log(`🚦 ${err} 🚦`)
    })
})

/*----- Controllers -----*/
app.use('/auth', require('./controllers/auth'))
app.use('/anime', require('./controllers/anime'))
app.use('/profile', require('./controllers/profile'))
app.use('/prompt', require('./controllers/prompt'))
app.use('/character', require('./controllers/character'))
app.use('/users', require('./controllers/users'))

/*----- Initialize app on Port -----*/
app.listen(process.env.PORT || 3000, () => {
    console.log(`🕺 Port: ${process.env.PORT} 💃`)
})