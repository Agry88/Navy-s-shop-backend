const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    detail: {
        type: String,
        required: true
    },
})
//匯出該資料表
module.exports = mongoose.model("test", testSchema);