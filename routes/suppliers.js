const express = require("express");
const router = express.Router();
const Suppliers = require("../models/suppliers");
const verifyToken_isAdmin = require('../middlewares/verifyToken_isAdmin')
const verifyToken_isUser = require('../middlewares/verifyToken_isUser')

//取得全部供應商
router.get("/", async (req, res) => {
    try {
        const Suppliers = await Suppliers.find();
        res.json(Suppliers);
    } catch (err) {
        //如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
    }
})

//新增供應商
router.post("/", verifyToken_isAdmin() , async (req, res) => {
    //從req.body中取出資料
    const Suppliers = new Suppliers({
        supname:req.body.supname,
        supaddr:req.body.supaddr,
        supphone:req.body.supphone,
        supemail:req.body.supemail,
        supworkarea:req.body.supworkarea,
        supcontactman:req.body.supcontactman,
    });
    try {
        const newSuppliers = await Suppliers.save();
        res.status(201).json(newSuppliers);
    } catch (err) {
        //錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
        res.status(400).json({ message : err.message })
    }
})

//檢視特定供應商
//在網址中傳入id用以查詢
router.get("/:id", getSupplier , verifyToken_isAdmin()  ,async (req, res) => {
    res.send(res.supplier)
})

//刪除供應商
router.delete("/:id", getSupplier, verifyToken_isAdmin(), async (req, res) => {
    try {
        //將取出的待辦事項刪除
        await res.supplier.remove();
        //回傳訊息
        res.json({ message:"Delete supplier succeed" })
    } catch (err) {
        //資料庫操作錯誤將回傳500及錯誤訊息
        res.status(500).json({ message:"remove supplier faild" })
    }
})

//更新供應商
router.patch("/:id", getSupplier ,verifyToken_isAdmin(), async (req, res) => {
    res.supplier.supsupname = req.body.supsupname
    res.supplier.supaddr = req.body.supaddr
    res.supplier.supphone = req.body.supphone
    res.supplier.supemail = req.body.supemail
    res.supplier.supworkarea = req.body.supworkarea
    res.supplier.supcontactman = req.body.supcontactman
    try {
        const updateSupplier = await res.supplier.save();
        res.json(updateSupplier);
    } catch (err) {
        //資料庫更新錯誤回傳400及錯誤訊息
        res.status(400).json({ message:"Update Supplier failed" }) //更新失敗
    }
})

//檢查是否有該供應商
async function getSupplier(req,res,next) {
    let supplier;
    try {
        supplier = await Suppliers.findById(req.params.id);
        if (supplier === undefined) {
            return res.status(404).json({ message:"Can't find supplier" })
        }
    } catch (err) {
        return res.status(500).json({ message:err.message })
    }
    res.supplier = supplier
    //在router中執行middleware後需要使用next()才會繼續往下跑
    next();
}

module.exports = router