const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/isLoggedIn')
const db = require('../models')
const methodOverride = require('method-override')
router.use(methodOverride('_method'))

router.get('/', isLoggedIn, (req, res) => {
    db.user.findOne({
        where: {
            id: req.user.id
        }
    }).then(user => {
        user.getAnimes().then(animes => {
            user.getPrompts({
                order: ['id'],
                include: [db.character]
            }).then(prompts => {
                res.render('profile/profile', { animes, prompts })
            }).catch(err => {
                console.log(`🚦 ${err} 🚦`)
            })
        }).catch(err => {
            console.log(`🚦 ${err} 🚦`)
        })
    }).catch(err => {
        console.log(`🚦 ${err} 🚦`)
    })
})

router.get('/edit', isLoggedIn, (req, res) => {
    db.user.findOne({
        where: {
            id: req.user.id
        }
    }).then(user => {
        user.getAnimes().then(animes => {
            user.getPrompts({include: [db.character]}).then(prompts => {
                res.render('profile/edit', { animes, prompts })
            })
        }).catch(err => {
            console.log(`🚦 ${err} 🚦`)
        })
    }).catch(err => {
        console.log(`🚦 ${err} 🚦`)
    })
})

router.put('/picture', (req, res) => {
    db.user.update({
        imageurl: req.body.imageurl
    }, {
        where: {
            id: req.user.id
        }
    }).then(res.redirect('/profile/edit'))
})

module.exports = router