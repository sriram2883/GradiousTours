const express=require('express')
const router = express.Router()
const JWT = require("jsonwebtoken");
const UserModel = require('../models/schemas/UserSchema');
const TravellerModel = require('../models/schemas/TravellerSchema');
const TourModel = require('../models/schemas/TourSchema');
const key = process.env.JWT_SECRET;
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    JWT.verify(token, key, (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        UserModel.findOne({email:user.email}).then((result)=>{
            if(result.length === 0){
                return res.sendStatus(401);
            }
            next();
        }).catch((err)=>{
            console.error(err);
            return res.sendStatus(500);
        });
    });
}

router.get('/tours',(req,res)=>{
    //sending all tours
    TourModel.find({}).then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.error(err);
        return res.sendStatus(500);
    });
})

router.get('/tour/:id',(req,res)=>{
    //sending respective tour
    TourModel.find({tour_id:req.params.id}).then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.error(err);
        return res.sendStatus(500);
    });
})

router.post('/tour/:id',authenticateToken,(req,res)=>{
    //adding commited tour
    TravellerModel.create({
        tour_id: req.params.id,
        count: req.body.count,
        phone: req.body.phone,
        email: req.body.email,
        username: req.body.username,
        bookedby:req.body.bookedby,
        date: req.body.date
    }).then((result)=>{
        res.status(201).json();
    }).catch((err)=>{
        console.error(err);
        return res.sendStatus(500);
    });
})


router.get('/bookedtours/:username',authenticateToken,(req,res)=>{
    //sending all booked 
    TravellerModel.find({username:req.params.username},{count:1,tour_id:1,bookedby:1,date:1}).then((result)=>{
        console.log(result);
        res.status(200).json(result);
    }).catch((err)=>{
        console.error(err);
        return res.sendStatus(500);
    });
})
router.get('/tours/popular',(req,res)=>{
    //sending popular tours
    TourModel.find({}).sort({'details.rating':-1}).then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.error(err);
        return res.sendStatus(500);
    });
});

router.get('/tours/highlyrecommended',(req,res)=>{
    //sending expensive tours
    TourModel.find({}).sort({'details.cost':-1}).then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.error(err);
        return res.sendStatus(500);
    });
});
module.exports = router;