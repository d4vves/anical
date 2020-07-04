const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios')
const methodOverride = require('method-override')
router.use(methodOverride('_method'))

router.get('/season', (req,res) => {
    if (!req.query.year) {
        req.flash('error', 'Please enter a valid year.')
        return res.redirect('/')
    } else {
        axios.get(`https://api.jikan.moe/v3/season/${req.query.year}/${req.query.season}`)
        .then((response) => {
        let resData = response.data
        res.render('anime/season', {
            season: resData.season_name,
            year: resData.season_year,
            anime: resData.anime
        })
        }).catch(err => {
        console.log(`🚦 ${err} 🚦`)
        })
    }
})

router.get('/:id', (req, res) => {
    axios.get(`https://api.jikan.moe/v3/anime/${req.params.id}`)
    .then((response) => {
        let resData = response.data
        res.render('anime/show', {
            name: resData.title,
            image: resData.image_url,
            airs: resData.broadcast,
            synopsis: resData.synopsis,
            engTitle: resData.title_english,
            malId: resData.mal_id,
            source: resData.source,
            airing: resData.aired.to
        })
    }).catch(err => {
        console.log(`🚦 ${err} 🚦`)
    })
})

router.post('/:id', (req, res) => {
    db.user.findOne({
        where: {
            id: req.user.id
        }
    }).then(user => {
        db.anime.findOrCreate({
            where: {
                malId: req.body.malId
            },
            defaults: {
                name: req.body.name,
                date: req.body.date,
                imageurl: req.body.imageurl,
                userId: req.user.id
            }
        }).then(([anime, created]) => {
            user.addAnime(anime)
            .then(res.redirect('/profile'))
        }).catch(err => {
            console.log(`🚦 ${err} 🚦`)
        })
    }).catch(err => {
        console.log(`🚦 ${err} 🚦`)
    })
})

router.delete('/:id', (req, res) => {
    db.user.findOne({
        where: {
            id:req.user.id
        }
    }).then(user => {
        db.anime.findOne({
            where: {
                malId: req.params.id
            }
        }).then(anime => {
            db.usersAnimes.findOne({
                where: {
                    userId: user.id,
                    animeId: anime.id
                }
            }).then(entry => {
                entry.destroy()
                res.redirect('/profile')
            })
        })
    })
})

module.exports = router