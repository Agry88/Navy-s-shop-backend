const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    }],
    is_paid:{
        type:Boolean,
        required:true
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    }
})
//匯出該資料表
module.exports = mongoose.model("order", orderSchema);