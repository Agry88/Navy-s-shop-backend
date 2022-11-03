const { BlobServiceClient } = require("@azure/storage-blob");
const multer = require("multer");
const upload = multer()
const express = require("express");
const router = express.Router();
const Products = require("../models/products");
const verifyToken_isAdmin = require('../middlewares/verifyToken_isAdmin')
const verifyToken_isUser = require('../middlewares/verifyToken_isUser')
const uploadBlob = require('../middlewares/uploadBlob')
const removeBlob = require('../middlewares/removeBlob')

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

//根據頁數取得部分商品
router.get("/p", async (req, res) => {
    const product_per_page = 20
    const page = req.query.page ?? 1
    try {
        const products = await Products.find()
            .limit(product_per_page)
            .skip(product_per_page * (page - 1))
            .sort({
                createdDate: 'desc'
            })
        res.json(products);
    } catch (err) {
        //如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
    }
})

//新增產品
router.post("/", verifyToken_isAdmin(),upload.single("image"),uploadBlob(),async (req, res) => {

    //檢查是否有重複名稱的產品
    const product = await Products.find({ name: req.body.name })
    if (product) {
        return res.status(403).json({ message: "已經有重複名稱的產品" })
    }

    const products = new Products({
        name: req.body.name,
        price: req.body.price,
        image: res.product.image,
        describe: req.body.describe,
        specifications: req.body.specifications,
    });
    try {
        const newproducts = await products.save();
        res.status(201).json(newproducts);
    } catch (err) {
        //錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
        res.status(400).json({ message: err.message })
    }
})

//檢視特定產品
//在網址中傳入id用以查詢
router.get("/:id", getProduct, verifyToken_isAdmin(), async (req, res) => {
    res.send(res.product)
})

//刪除產品
router.delete("/:id", verifyToken_isAdmin(),getProduct,removeBlob(), async (req, res) => {
    try {
        await res.product.remove();
        //回傳訊息
        res.status(200).json({ message: "Delete product succeed" })
    } catch (err) {
        //資料庫操作錯誤將回傳500及錯誤訊息
        res.status(500).json({ message: "remove product faild" })
    }
})

//更新產品
router.patch("/:id", verifyToken_isAdmin(),getProduct, async (req, res) => {
    res.product.name = req.body.name
    res.product.price = req.body.price
    res.product.image = req.body.image
    res.product.describe = req.body.describe
    res.product.specifications = req.body.specifications
    try {
        const updateProduct = await res.product.save();
        res.json(updateProduct);
    } catch (err) {
        //資料庫更新錯誤回傳400及錯誤訊息
        res.status(400).json({ message: "Update User failed" }) //更新失敗
    }
})

//檢查是否有該產品
async function getProduct(req, res, next) {
    let product;
    try {
        product = await Products.findById(req.params.id);
        if (product === undefined) {
            return res.status(404).json({ message: "Can't find product" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.product = product
    //在router中執行middleware後需要使用next()才會繼續往下跑
    next();
}

module.exports = router