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
    }).then(([character, created]) => {
        db.prompt.update({
            characterId: character.id
        }, {
            where: {
                id: req.body.promptId
            }
        }).then(res.redirect('/profile/edit'))
    }).catch(err => {
        console.log(`🚦 ${err} 🚦`)
    })
})

router.get('/search', (req, res) => {
    axios.get(`https://api.jikan.moe/v3/search/character?q=${req.query.name}`)
    .then(response => {
        let promptId = req.query.promptId
        let characters = response.data.results
        res.render('character/characters', { characters, promptId })
    }).catch(err => {
        console.log(`🚦 ${err} 🚦`)
    })
})

module.exports = router