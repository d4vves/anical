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
            console.log(animes)
            res.render('profile', { animes })
        }).catch(err => {
            console.log(`🚦 ${err} 🚦`)
        })
    }).catch(err => {
        console.log(`🚦 ${err} 🚦`)
    })
})

module.exports = router