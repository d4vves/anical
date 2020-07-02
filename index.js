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
    // check to see if user is logged in
    res.render('index')
})

app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile')
})

/*----- Controllers -----*/
app.use('/auth', require('./controllers/auth'))

/*----- Initialize app on Port -----*/
app.listen(process.env.PORT || 3000, () => {
    console.log(`🕺 Port: ${process.env.PORT} 💃`)
})