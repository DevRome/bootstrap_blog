const express = require("express");
const router = express.Router()
const mongoose = require("mongoose")
const Player = require("../models/player")


// All players GET
router.get("/", async(req, res)=>{
    try{
        const allPlayers = await Player.find({})
        res.render("players/all-players", {allPlayers: allPlayers})
    }catch(err){
        console.log(err)
        res.redirect("/")
    }
})

// Single player GET
router.get("/player/:id", async(req, res)=>{
    try{
        const player = await Player.findById(req.params.id)
        res.render("players/player", {player : player})
    }catch(err){
        console.log(err)
        res.redirect("/")
    }
})

module.exports = router;