const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios')
const methodOverride = require('method-override')
router.use(methodOverride('_method'))

router.get('/search', (req, res) => {
    if(!req.query.name) {
        req.flash('error', 'Please enter a valid title.')
        return res.redirect('/')
    } else {
        axios.get(`https://api.jikan.moe/v3/search/anime?q=${req.query.name}`)
        .then(response => {
            let anime = response.data.results
            let search = req.query.name
            console.log(`🤡 ${anime}`)
            res.render('anime/anime', { anime, search })
        }).catch(err => {
            console.log(`🚦 ${err} 🚦`)
        })
    }
})

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
        let backUrl = req.header('Referer')
        if (!req.user) {
            res.render('anime/show', {
                name: resData.title,
                image: resData.image_url,
                airs: resData.broadcast,
                synopsis: resData.synopsis,
                engTitle: resData.title_english,
                malId: resData.mal_id,
                source: resData.source,
                caldate: resData.aired.from,
                airdate: resData.aired.string,
                airing: resData.aired.to,
                backUrl
            })
        } else {
            db.user.findOne({
                where: {
                    id: req.user.id
                }
            }).then(user => {
                user.getAnimes({
                    where: {
                        malId: req.params.id
                    }
                }).then(animes => {
                    res.render('anime/show', {
                        name: resData.title,
                        image: resData.image_url,
                        airs: resData.broadcast,
                        synopsis: resData.synopsis,
                        engTitle: resData.title_english,
                        malId: resData.mal_id,
                        source: resData.source,
                        caldate: resData.aired.from,
                        airdate: resData.aired.string,
                        airing: resData.aired.to,
                        animes,
                        backUrl
                    })
                }).catch(err => {
                    console.log(`🚦 ${err} 🚦`)
                })
            }).catch(err => {
                console.log(`🚦 ${err} 🚦`)
            })
        }
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
                airdate: req.body.airdate,
                caldate: req.body.caldate,
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
            id: req.user.id
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