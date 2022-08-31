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

const membersRouter = require("./routes/members");
app.use("/api/members",membersRouter);

///設定Server的Port
app.listen(process.env.PORT || 3000, process.env.YOUR_HOST || '0.0.0.0' , () => console.log("server started"))
