const mongoose = require('mongoose');

const suppliersSchema = new mongoose.Schema({
    supid:{
        type:String, 
        required:true
    },
    supname:{ 
        type:String,
        required:true,
    },
    supaddr:{ 
        type:String,
        required:true,
    },
    supphone:{ 
        type:number,
        required:true,
    },
    supemail:{ 
        type:String,
        required:true,
    },
    supworkarea:{ 
        type:String,
        required:true,
    },
    supcontactman:{
        type: String,
        required:true
    },
    createdDate:{
        type: Date,
        default: Date.now,
        required:true
    },
})
//匯出該資料表
module.exports = mongoose.model("suppliers" , suppliersSchema);