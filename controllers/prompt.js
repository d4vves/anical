const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/isLoggedIn')
const db = require('../models')

router.post('/', (req, res) => {
    db.user.findByPk(req.user.id)
    .then(user => {
        user.createPrompt({
            text: req.body.text
        }).then(res.redirect('/profile'))
    }).catch(err => {
        console.log(`🚦 ${err} 🚦`)
    })
})

module.exports = router