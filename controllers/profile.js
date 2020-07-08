const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/isLoggedIn')
const db = require('../models')

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

module.exports = router