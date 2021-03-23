const express = require("express")
const expressEjsLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const app = express()
const path = require("path")
const methodOverride = require("method-override")
const fs = require("fs")
const multer = require("multer")
require("dotenv").config()
var crypto = require('crypto');
const PORT = process.env.PORT || 3000

// Connection to MongoDB
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once("open", ()=>{ console.log("Connected to db!")})

// Use method-override
app.use(methodOverride("_method"))

// MULTER
var storage = multer.diskStorage({
    //folder upload -> public/upload
    destination: 'public/upload/',
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)
        cb(null, Math.floor(Math.random()*9000000000) + 1000000000 + path.extname(file.originalname))
      })
    }
  })
  var upload = multer({ storage: storage });

// Set body-parser
app.use(express.json({limit: '50mb', extended: false}));
app.use(express.urlencoded({limit: '50mb', extended: false})); //provare con false eventualmemte

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
const adminRouter = require("./routes/admin")
app.use("/", indexRouter)
app.use("/players", playerRouter)
app.use("/admin", adminRouter)

//CKEDITOR
/* app.get('/', function (req, res) {
    var title = "Plugin Imagebrowser ckeditor for nodejs"
    res.render('index', { result: 'result' })
  }) */

  //show all image in folder upload to json
app.get('/files', function (req, res) {
    const images = fs.readdirSync('public/upload')
    var sorted = []
    for (let item of images){
        if(item.split('.').pop() === 'png'
        || item.split('.').pop() === 'jpg'
        || item.split('.').pop() === 'jpeg'
        || item.split('.').pop() === 'svg'){
            var abc = {
                  "image" : "/upload/"+item,
                  "folder" : '/'
            }
            sorted.push(abc)
        }
    }
    res.send(sorted);
  })

  //upload image to folder upload
  app.post('/upload', upload.array('flFileUpload', 12), function (req, res, next) {
      res.redirect('back')
  });
  
  //delete file
  app.post('/delete_file', function(req, res, next){
    var url_del = 'public' + req.body.url_del
    console.log(url_del)
    if(fs.existsSync(url_del)){
      fs.unlinkSync(url_del)
    }
    res.redirect('back')
  });

// Start server
app.listen(PORT, ()=>{
    console.log("Server running on port: ", PORT)
})


