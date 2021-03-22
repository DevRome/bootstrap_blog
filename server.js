const express = require("express")
const expressEjsLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const app = express()
const path = require("path")
require("dotenv").config()
const PORT = process.env.PORT || 3000

// Connection to MongoDB
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once("open", ()=>{ console.log("Connected to db!")})

// Set body-parser
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

// Set static path
app.use(express.static(path.join(__dirname, "public")))

// Set views directory and view engine
app.set("views", (path.join(__dirname, "views")))
app.set("view engine", "ejs")
app.set("layout", "layouts/layout")
app.use(expressEjsLayouts)

// Set the router
const indexRouter = require("./routes/index")
const playerRouter = require("./routes/players")
app.use("/", indexRouter)
app.use("/players", playerRouter)

// Start server
app.listen(PORT, ()=>{
    console.log("Server running on port: ", PORT)
})


