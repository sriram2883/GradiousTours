const express = require('express');
const app = express();
const cors =require('cors')
const jwt = require('jsonwebtoken');
const corsOptions={
    origin:'*',
    optionsSuccessStatus:200
}
require('dotenv').config();
const db = require('./models/database');
app.use(cors(corsOptions))
app.use(express.json());
const AdminRoutes = require("./routes/AdminRoutes");
const UserRoutes = require("./routes/UserRoutes");
const GuideRoutes = require("./routes/GuideRoutes");
const LoginRoutes = require("./routes/LoginRoutes");
app.post('/verify',(req,res)=>{
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            res.status(403).send("Invalid token");
        }
        res.status(200).send("User is authenticated");
    })
})
app.use('/admin',AdminRoutes);
app.use('/user',UserRoutes);
app.use('/guide',GuideRoutes);
app.use('/login',LoginRoutes);
app.listen(3001,(req,res)=>{
    console.log("server is up on port 3001");
})