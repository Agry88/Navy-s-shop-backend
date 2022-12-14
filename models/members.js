const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    is_activated: {
        type: Boolean,
        default: false,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    },
})
//匯出該資料表
module.exports = mongoose.model("member", memberSchema);