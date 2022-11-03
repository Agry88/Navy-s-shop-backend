const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name:{
        type:String, 
        required:true
    },
    price:{ 
        type:String,
        required:true,
    },
    image:{ 
        type:String,
        required:true,
    },
    describe:{ 
        type:String,
        required:true,
    },
    specifications:{ 
        type:String,
        required:true,
    },
    createdDate:{
        type: Date,
        default: Date.now,
        required:true
    },
})
//匯出該資料表
module.exports = mongoose.model("products" , productsSchema);