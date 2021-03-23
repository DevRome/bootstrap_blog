const express = require("express");
const router = express.Router()
const Player = require("../models/player")


router.get("/", async(req, res)=>{

    // funzione di ricerca, search utilizza GET dal form che invia dati, quindi il dato è memorizzato in req.query
    let searchOptions = {}; // inizializza il parametro che giù passerà a find(); 
    if(req.query.search != null && req.query.search !== ""){ // search è il nome dato alla casella di ricerca
        searchOptions.name = new RegExp(req.query.search, "i") //name, find() cercherà il campo name della collection
    }

    // recupera tutti i dati dal database
    try{
        const players = await Player.find(searchOptions)
        res.render("index", {
            players: players,
            searchOptions: req.query
        })
    }catch(err){
        res.redirect("/")
    }


   
})


module.exports = router;