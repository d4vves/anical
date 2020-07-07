const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/isLoggedIn')
const db = require('../models')
const methodOverride = require('method-override')
router.use(methodOverride('_method'))

router.post('/', (req, res) => {
    db.user.findByPk(req.user.id)
    .then(user => {
        user.createPrompt({
            text: req.body.text
        }).then(res.redirect('/profile/edit'))
    }).catch(err => {
        console.log(`🚦 ${err} 🚦`)
    })
})

router.delete('/:id', (req, res) => {
    db.prompt.destroy({
        where: {
            id: req.params.id
        }
    }).then(res.redirect('/profile/edit'))
})

module.exports = router