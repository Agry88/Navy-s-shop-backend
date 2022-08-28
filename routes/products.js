const express = require("express");
const router = express.Router();
const Products = require("../models/products");

//取得全部產品
router.get("/", async (req, res) => {
    try {
        const products = await Products.find();
        res.json(products);
    } catch (err) {
        //如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
    }
})

//新增產品
router.post("/", async (req, res) => {
    //從req.body中取出資料
    const products = new Products({
        name:req.body.name,
        price:req.body.price,
        image:req.body.image,
        describe:req.body.describe,
        specifications:req.body.specifications,
        delivery_way:req.body.delivery_way,
    });
    try {
        const newproducts = await products.save();
        res.status(201).json(newproducts);
    } catch (err) {
        //錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
        res.status(400).json({ message : err.message })
    }
})

//檢視特定產品
//在網址中傳入id用以查詢
router.get("/:id", getProduct  ,async (req, res) => {
    res.send(res.product)
})

//刪除產品
router.delete("/:id", getProduct, async (req, res) => {
    try {
        //將取出的待辦事項刪除
        await res.product.remove();
        //回傳訊息
        res.json({ message:"Delete product succeed" })
    } catch (err) {
        //資料庫操作錯誤將回傳500及錯誤訊息
        res.status(500).json({ message:"remove product faild" })
    }
})

//更新產品
router.patch("/:id", getProduct , async (req, res) => {
    res.product.name = req.body.name
    res.product.price = req.body.price
    res.product.image = req.body.image
    res.product.describe = req.body.describe
    res.product.specifications = req.body.specifications
    res.product.delivery_way = req.body.delivery_way
    try {
        const updateProduct = await res.product.save();
        res.json(updateProduct);
    } catch (err) {
        //資料庫更新錯誤回傳400及錯誤訊息
        res.status(400).json({ message:"Update User failed" }) //更新失敗
    }
})

//檢查是否有該產品
async function getProduct(req,res,next) {
    let product;
    try {
        product = await Products.findById(req.params.id);
        if (product === undefined) {
            return res.status(404).json({ message:"Can't find product" })
        }
    } catch (err) {
        return res.status(500).json({ message:err.message })
    }
    res.product = product
    //在router中執行middleware後需要使用next()才會繼續往下跑
    next();
}

module.exports = router