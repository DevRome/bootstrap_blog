const express = require("express");
const router = express.Router()
const mongoose = require("mongoose")
const Player = require("../models/player")
const ImageMimeTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"]



router.get("/", (req, res)=>{
    res.render("players/all_players")
})


router.get("/new", (req, res)=>{
    res.render("players/new_player")
})


router.post("/new", async(req, res)=>{
    const player = new Player({
        name: req.body.name,
        nickName: req.body.nickName,
        bands: req.body.bands,
        dateBorn: new Date(req.body.dateBorn),
        dateDeath: new Date(req.body.dateDeath),
        country: req.body.country
    })
    saveImage(player, req.body.coverImage);

    try{
        const newPlayer = await player.save()
        res.redirect("/players/player/"+ newPlayer._id )
    }catch(err){
        console.log(err)
        res.redirect("/")
    }
})

router.get("/player/:id", async(req, res)=>{
    try{
        const player = await Player.findById(req.params.id)
        res.render("players/player", {player : player})
    }catch(err){
        console.log(err)
        res.redirect("/")
    }
})

// Funzione di Filepload per caricare l'immagine
function saveImage(player, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && ImageMimeTypes.includes(cover.type)){
        player.coverImage = new Buffer.from(cover.data, "base64");
        player.coverImageType = cover.type
    }

}

module.exports = router;