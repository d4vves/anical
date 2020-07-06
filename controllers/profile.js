const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/isLoggedIn')
const db = require('../models')

router.get('/', isLoggedIn, (req, res) => {
    db.user.findOne({
        where: {
            id: req.user.id
        },
        include: [db.prompt]
    }).then(user => {
        user.getAnimes().then(animes => {
            res.render('profile', {
                animes,
                prompts: user.prompts
            })
        }).catch(err => {
            console.log(`🚦 ${err} 🚦`)
        })
    }).catch(err => {
        console.log(`🚦 ${err} 🚦`)
    })
})

module.exports = router