const express = require("express");
const router = express.Router();
const Members = require("../models/members");
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken')
const sendSignUpEmail = require('../functions/sendSignUpEmail')

//取得全部會員
router.get("/", verifyToken("admin"), async (req, res) => {
    try {
        const members = await Members.find();
        res.json(members);
    } catch (err) {
        //如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
    }
})

//發送認證信件 並創建會員
router.post("/signup", checkUserAccount ,async (req, res) => {
    try {
        const send_email_res = await sendSignUpEmail(req.body.email)
        if (send_email_res.status === 400) return

        const members = new Members({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            role:"user"
        });
        try {
            const newmembers = await members.save();
            res.status(201).json(newmembers);
        } catch (err) {
            //錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
            res.status(400).json({ message: err.message})
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
        res.status(200).send('註冊成功！您已經可以關閉這個頁面！');
    } catch (err) {
        //資料庫更新錯誤回傳400及錯誤訊息
        res.status(400).json({ message: "認證會員失敗，請重新再試一次", error: err }) //更新失敗
    }
})

//登入會員
router.post("/login", async (req, res) => {
    try {
        const member = await Members.findOne({ email: req.body.email });
        if (!member) {
            return res.status(404).json({ message: "Can't find member" })
        }
        if (member.password !== req.body.password) {
            return res.status(404).json({ message: "Password is wrong" })
        }
        const info = { user_name: member.name, role: member.role }
        const token = jwt.sign(info, process.env.JWT_SECRET_KEY, { expiresIn: 1000 * 60 * 15 });
        res.cookie('token', token, { maxAge: 1000 * 60 * 15, httpOnly: true });
        res.json({ message: "登入成功！" });
    } catch (err) {
        //如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
    }
})

//登出會員
router.get("/logout", async (req, res) => {
    try {
        return res
            .clearCookie("token")
            .status(200)
            .json({ message: "Successfully logged out" });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//刪除會員
router.delete("/:id", verifyToken("admin"),  async (req, res) => {
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
        res.status(500).json({ message: "remove product faild" })
    }
})

//檢查是否有該會員byToken
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

async function checkUserAccount(req, res, next) {
    let member;
    try {
        member = await Members.findOne({ email: req.body.email });
        if (member) {
            return res.status(400).json({ message: "This Email has being registered" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.member = member
    next();
}


module.exports = router