const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.HOST_EMAIL_PASSWORD
    }
});

module.exports = async function sendSignUpEmail(email) {
    return new Promise((resolve, reject) => {
        const create_token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY);

        const options = {
            //寄件者
            from: process.env.HOST_EMAIL,
            //收件者
            to: email,
            //主旨
            subject: '請點選連結來認證您在海軍商城的會員註冊', // Subject line
            //嵌入 html 的內文
            html: `<h2>親愛的會員您好：<br />感謝您註冊海軍商城會員<br/>請點擊下方連結完成電子信箱認證<br /><a href="https://navys-shop-backend.herokuapp.com/api/members/verify/${create_token}">請點這裡</a><br />不是您本人嗎?請直接忽略或刪除此信件，<br />如有問題請撥打客服專線0800-024-550，謝謝！</h2>`,
        };

        //發送郵件
        transporter.sendMail(options, function (error, info) {
            if (error) {
                console.log(error);
                reject({ status: 400, msg: error })
            } else {
                console.log('訊息發送: ' + info.response);
                resolve({ status: 200, msg: 'Succeed send email' })
            }
        });
    })
}