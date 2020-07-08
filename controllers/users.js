const express = require('express')
const router = express.Router()
const db = require('../models')
const { Op } = require("sequelize");

router.get('/', (req, res) => {
    db.user.findAll({
        where: {
            [Op.not]: [
                {id: req.user.id}
            ]
        }
    }).then(users => {
        res.render('users/users', { users })
    })
})

router.get('/:id', (req, res) => {
    db.user.findOne({
        where: {
            id: req.params.id
        }
    }).then(user => {
        user.getAnimes().then(animes => {
            user.getPrompts({include: [db.character]}).then(prompts => {
                res.render('users/show', { animes, prompts, user })
            })
        })
    })
})

module.exports = router