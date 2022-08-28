const express = require('express');
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.DB_NAME);
const db = mongoose.connection;

db.on('err',err => console.log(err));

db.once('open' , () => console.log('connected to database'));
app.use(express.json());

const productsRouter = require("./routes/products");
app.use("/api/products",productsRouter);

///設定Server的Port
app.listen(3000 , () => console.log("server started"))
