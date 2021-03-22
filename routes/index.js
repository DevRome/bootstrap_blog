const express = require("express");
const router = express.Router()
const Player = require("../models/player")


router.get("/", (req, res)=>{
    res.render("index")
})


module.exports = router;