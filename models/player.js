const mongoose = require("mongoose")

const playerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    nickName:{
        type: String,
        required: true
    },
    bands:{
        type:String,
        required: false
    },
    dateBorn:{
        type: Date,
        required: true
    },
    dateDeath:{
        type: Date,
        required: false
    }, 
    country:{
        type:String,
        required:true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    },
    coverImage:{
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    }
})

// Per recuperare l'immagine e poterla visualizzare
playerSchema.virtual("coverImagePath").get(function() {
    if(this.coverImage != null && this.coverImageType != null){
        return "data:" + this.coverImageType + ";charset=utf-8;base64,"+ this.coverImage.toString("base64")
    }
})

module.exports = mongoose.model("Player", playerSchema)
// Player sarà quindi il nome dello schema e della tabella nel db Mongo
// playerSchema è il nome della constante che definisce la struttura dello schema