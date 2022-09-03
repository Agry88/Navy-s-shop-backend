const express = require("express");
const router = express.Router();
const Test = require("../models/Test");

//取得全部測試
router.get("/", async (req, res) => {
    try {
        const test = await Test.find();
        res.json(test);
    } catch (err) {
        //如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
    }
})

//新增測試
router.post("/", async (req, res) => {
    //從req.body中取出資料
    const test = new Test({
        detail:req.body.detail,
    });
    try {
        const newtest = await test.save();
        res.status(201).json(newtest);
    } catch (err) {
        //錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
        res.status(400).json({ message : err.message })
    }
})

//檢視特定測試
//在網址中傳入id用以查詢
router.get("/:id", getTest ,async (req, res) => {
    res.send(res.test)
})

//刪除測試
router.delete("/:id", getTest, async (req, res) => {
    try {
        //將取出的待辦事項刪除
        await res.test.remove();
        //回傳訊息
        res.json({ message:"Delete test succeed" })
    } catch (err) {
        //資料庫操作錯誤將回傳500及錯誤訊息
        res.status(500).json({ message:"remove test faild" })
    }
})

//檢查是否有該產品
async function getTest(req,res,next) {
    let test;
    try {
        test = await Test.findById(req.params.id);
        if (test === undefined) {
            return res.status(404).json({ message:"Can't find test" })
        }
    } catch (err) {
        return res.status(500).json({ message:err.message })
    }
    res.test = test
    //在router中執行middleware後需要使用next()才會繼續往下跑
    next();
}

module.exports = router