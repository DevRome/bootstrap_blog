const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Player = require("../models/player")
const User = require("../models/User")
const ImageMimeTypes = ["image/jpg", "image/jpeg", "image/png", "iage/gif"]

const passport = require("passport");
const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const session = require("express-session")

// Session and flash
router.use(session({
    secret: "secret",
    cookie: {maxAge:60000},
    resave: false,
    saveUninitialized: false
}))

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser(function(user, done){
    done(null, user.id)
})

passport.deserializeUser(function(id, done){
    User.findById(id, function(err,user){
        done(err,user)
    })
})


passport.use(new localStrategy(function(username, password, done){
    User.findOne({username:username}, function(err, user){
        if(err)return done(err)
        if(!user) return done(null, false, {message: "incorrect username"})

        bcrypt.compare(password, user.password, function(err, res){
            if(err) return done(err)
            if (err==false) return done(null, false, {message: "incorrect password"})

            return done(null, user)
        })
    })
}))



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/admin/login")
}

function isLoggedOut(req,res, next){
    if(!req.isAuthenticated()) return next();
    res.redirect("/")
}

// ---------- Login ---------- //

// Login & Logout route
router.get("/login", isLoggedOut, (req, res)=>{
    const response = {
        title: "login",
        error: req.query.error
    }
    res.render("admin/login", response)
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/admin/",
    failure: "/login?error=true"
}))

router.get("/logout", function (req, res){
    req.logOut();
    res.redirect("/")
})

// Setup admin user
router.get("/setup", async(req, res)=>{
    const exists = await User.exists({username: "admin"})

    if(exists){
        res.redirect("/admin/login");
        return;
    }

    bcrypt.genSalt(10, function(err, salt){
        if(err) return next(err);
        bcrypt.hash("lollo_bello", salt, function (err, hash){
            if (err) return next(err);

            const newAdmin = new User({
                username: "admin",
                password: hash
            });

            newAdmin.save()
            res.redirect("/admin/login");
        })
    })
})


// Admin Dashboard
router.get("/", isLoggedIn, async(req, res)=>{
    try{
        const allPlayers = await Player.find({})/* .sort({ createdAt: "desc"}).exec() */
        res.render("admin/admin-dashboard", {allPlayers: allPlayers})
    }catch(err){
        console.log(err)
        res.redirect("/")
    }
})

// New player GET
router.get("/new", isLoggedIn, (req, res)=>{
    res.render("admin/new-player")
})

// New player POST
router.post("/new", async(req, res)=>{
    console.log(req.body)
    const player = new Player({
        name: req.body.name,
        nickName: req.body.nickName,
        bands: req.body.bands,
        dateBorn: new Date(req.body.dateBorn),
        dateDeath: new Date(req.body.dateDeath),
        country: req.body.country,
        content: req.body.content
    })
    console.log(player)
    saveImage(player, req.body.coverImage);

    try{
        const newPlayer = await player.save()
        res.redirect("../players/player/"+ newPlayer._id )
    }catch(err){
        console.log(err)
        res.redirect("/")
    }
})

// Edit Player - GET
router.get("/edit/:id", async(req, res)=>{
    try{
        const id = req.params.id;
        const player = await Player.findById({_id: id});
        res.render("admin/edit-player", {player: player})
    }catch(err){
        console.log(err)
        res.redirect("/")
    }
})

// Edit Player - PUT
router.put("/edit/:id", async(req, res)=>{
    console.log(req.body)
    let player
    try{
            player = await Player.findById(req.params.id)
            player.name = req.body.name
            player.nickName = req.body.nickName
            player.bands = req.body.bands
            player.dateBorn = new Date(req.body.dateBorn)
            player.country = req.body.country
            player.content = req.body.content

            // Controlla se è stata inserita la data di morte
            if(req.body.dateDeath != null && req.body.dateDeath != ""){
                player.dateDeath = new Date(req.body.dateDeath)
            }else{
                player.dateDeath = ""
            }

            // Controlla se l'immagine è stata cambiata
            if(req.body.coverImage != null && req.body.coverImage !== ""){
                saveImage(player, req.body.coverImage)
            }

            await player.save()
            res.redirect("/players/player/" + req.params.id)
            /* res.redirect("/players/player") */
        }catch(err){
            console.log(err)
        }
    })

// Delete 
router.delete("/admin/delete/:id", async(req, res)=>{
    try{
        const id = req.params.id;
        const player = await Player.findById({_id: id});
        await player.remove()
        res.redirect("/admin/")
    }catch(err){
        console.log(err)
        res.redirect("/admin/")
    }
})


// Funzione di Filepload per caricare l'immagine nel database
function saveImage(player, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && ImageMimeTypes.includes(cover.type)){
        player.coverImage = new Buffer.from(cover.data, "base64");
        player.coverImageType = cover.type
    }

}


module.exports = router;