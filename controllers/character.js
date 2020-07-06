const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios')
const methodOverride = require('method-override')
router.use(methodOverride('_method'))

router.post('/', (req, res) => {
    db.character.findOrCreate({
        where: {
            name: req.body.name
        },
        defaults: {
            imageurl: req.body.imageurl
        }
    }).then(res.redirect('/profile'))
})

router.get('/search', (req, res) => {
    axios.get(`https://api.jikan.moe/v3/search/character?q=${req.query.name}`)
    .then(response => {
        let characters = response.data.results
        res.render('character/characters', { characters })
    }).catch(err => {
        console.log(`🚦 ${err} 🚦`)
    })
})

module.exports = router