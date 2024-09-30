const express=require('express')
const router = express.Router()
const JWT = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const UserModel = require('../models/schemas/UserSchema');
const GuideModel = require('../models/schemas/GuideSchema');
const AdminModel = require('../models/schemas/AdminSchema');
const key = process.env.JWT_SECRET;
router.post('/register',(req,res)=>{
    const {username,email,password}=req.body;
    //hash and store details in db
    bcrypt.hash(password, 10, async(err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }
        try{
        const result = await UserModel.create({username:username,email:email,password:hash});
        return res.status(201).json('User created');
        }
        catch(err){
            console.error(err);
            return res.status(500).json({ error: 'Internal server error', details: (err.code == 11000) ? "duplicate values" : err.message });
        }
    });
})

router.post('/',(req,res)=>{
    const {email,password,usertype} = req.body;
    if(usertype == 'guide'){
        GuideModel.findOne({email:email}).then((result)=>{
            if(result.length === 0){
                return res.status(401).send('User not found');
            }
            const user = {username:result.username,email:result.email,usertype};
            // console.log(user);
            bcrypt.compare(password, result.password, (err, isMatch) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal server error');
                }
                if (isMatch) {
                    const token = JWT.sign({ email:email }, key, { expiresIn: '24h' });
                    return res.status(200).json({ token: token , user:user});
                }
                res.status(401).send('Invalid credentials');
            });
        }).catch((err)=>{
            console.error(err);
            return res.status(500).send('Internal server error');
        });
    }
    else
    if(usertype == 'admin'){
        // console.log('admin');
        AdminModel.findOne({email:email}).then((result)=>{
            if(result.length === 0){
                return res.status(401).send('User not found');
            }
            const user = {username:result.username,email:result.email , usertype};
            bcrypt.compare(password, result.password, (err, isMatch) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal server error');
                }
                if (isMatch) {
                    const token = JWT.sign({ email:email }, key, { expiresIn: '24h' });
                    return res.status(200).json({ token: token , user: user });
                }
                res.status(401).send('Invalid credentials');
            });
        }).catch((err)=>{
            console.error(err);
            return res.status(500).send('Internal server error');
        });
    }
    else
    if(usertype == 'user'){
        UserModel.findOne({email:email}).then((result)=>{
            if(result.length === 0){
                return res.status(401).send('User not found');
            }
            const user = {username:result.username,email:result.email , usertype};
            bcrypt.compare(password, result.password, (err, isMatch) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal server error');
                }
                if (isMatch) {
                    const token = JWT.sign({ email:email }, key, { expiresIn: '24h' });
                    return res.status(200).json({ token: token  , user: user });
                }
                res.status(401).send('Invalid credentials');
            });
        }).catch((err)=>{
            console.error(err);
            return res.status(500).send('Internal server error');
        });
    }

});
module.exports=router;