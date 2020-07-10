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
    }).catch(err => {
        console.log(`🚦 ${err} 🚦`)
    })
})

router.get('/:id', (req, res) => {
    db.user.findOne({
        where: {
            id: req.user.id
        }
    }).then(viewer => {
        viewer.getAnimes().then(viewerAnimes => {
            db.user.findOne({
                where: {
                    id: req.params.id
                }
            }).then(profile => {
                profile.getAnimes().then(profileAnimes => {
                    profile.getPrompts({include: [db.character]}).then(prompts => {
                        res.render('users/show', {
                            viewer,
                            viewerAnimes,
                            profile,
                            profileAnimes,
                            prompts
                        }).catch(err => {
                            console.log(`🚦 ${err} 🚦`)
                        })
                    }).catch(err => {
                        console.log(`🚦 ${err} 🚦`)
                    })
                }).catch(err => {
                    console.log(`🚦 ${err} 🚦`)
                })
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

module.exports = router