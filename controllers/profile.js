const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/isLoggedIn')
const db = require('../models')

router.get('/', isLoggedIn, (req, res) => {
    db.anime.findAll({
        where: {
            userId: req.user.id
        },
        include: [db.user]
    }).then(anime => {
        res.render('profile', { anime })
    })
})

module.exports = router