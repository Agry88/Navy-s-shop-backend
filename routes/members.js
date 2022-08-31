const express = require("express");
const router = express.Router();
const Members = require("../models/members");
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

//宣告發信物件
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.HOST_EMAIL_PASSWORD
    }
});

//取得全部會員
router.get("/", async (req, res) => {
    try {
        const members = await Members.find();
        res.json(members);
    } catch (err) {
        //如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
    }
})

//發送認證信件 並創建會員
router.post("/send", async (req, res) => {
    try {
        const create_token = jwt.sign({email: req.body.email}, process.env.JWT_SECRET_KEY);

        //信件內容
        const options = {
            //寄件者
            from: process.env.HOST_EMAIL,
            //收件者
            to: req.body.email,
            //主旨
            subject: '請點選連結來認證您在海軍商城的會員註冊', // Subject line
            //嵌入 html 的內文
            html: `<h2>親愛的會員您好：<br />感謝您註冊海軍商城會員<br/>請點擊下方連結完成電子信箱認證<br /><a href="https://navys-shop-backend.herokuapp.com/api/members/verify/${create_token}">請點這裡</a><br />不是您本人嗎?請直接忽略或刪除此信件，<br />如有問題請撥打客服專線0800-024-550，謝謝！</h2>`,
        };

        //發送郵件
        transporter.sendMail(options, function (error, info) {
            if (error) {
                return console.log(error);
            } else {
                console.log('訊息發送: ' + info.response);
            }
        });

        const members = new Members({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            address: req.body.address,
            phone_number: req.body.phone_number,
        });
        try {
            const newmembers = await members.save();
            res.status(201).json(newmembers);
        } catch (err) {
            //錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
            res.status(400).json({ message: err.message })
        }
    } catch (err) {
        //如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
    }
})

//Middleware確認認證會員的token是否有效 將會員的is_activated改成true
router.get("/verify/:create_token", checkToken, async (req, res) => {
    res.member.is_activated = true
    try {
        const updateMember = await res.member.save();
        res.json(updateMember);
    } catch (err) {
        //資料庫更新錯誤回傳400及錯誤訊息
        res.status(400).json({ message: "Update Member failed" , error:err }) //更新失敗
    }
})

//刪除會員
router.delete("/:id", async (req, res) => {
    try {
        const member = await Members.findById(req.params.id);
        if (member === undefined) {
            return res.status(404).json({ message: "Can't find member" })
        }
        await member.remove();
        //回傳訊息
        res.json({ message: "Delete member succeed" })
    } catch (err) {
        //資料庫操作錯誤將回傳500及錯誤訊息
        res.status(500).json({ message: "remove product faild"})
    }
})

//檢查是否有該會員
async function checkToken(req, res, next) {
    let member;
    try {
        const decoded = jwt.verify(req.params.create_token, process.env.JWT_SECRET_KEY);
        member = await Members.findOne({ email: decoded.email });
        if (member === undefined) {
            return res.status(404).json({ message: "Can't find member" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.member = member
    next();
}


module.exports = router