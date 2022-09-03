const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require('cors')

require('dotenv').config();

mongoose.connect(process.env.DB_NAME);
const db = mongoose.connection;

db.on('err',err => console.log(err));

db.once('open' , () => console.log('connected to database'));
app.use(express.json());
app.use(cookieParser());
app.use(cors())

const productsRouter = require("./routes/products");
app.use("/api/products",productsRouter);

const membersRouter = require("./routes/members");
app.use("/api/members",membersRouter);

const testRouter = require("./routes/test");
app.use("/api/test",testRouter);

///設定Server的Port
app.listen(process.env.PORT || 3000, process.env.YOUR_HOST || '0.0.0.0' , () => console.log("server started"))
