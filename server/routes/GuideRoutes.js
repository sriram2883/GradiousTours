const express = require('express')
const router = express.Router()
const JWT = require('jsonwebtoken')
const TravellerModel = require('../models/schemas/TravellerSchema')
const GuideModel = require('../models/schemas/GuideSchema')
const TourModel = require('../models/schemas/TourSchema')
const Guide = require('../models/schemas/GuideSchema')
const key = process.env.JWT_SECRET;
const twilio = require('twilio');
const client= new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH)
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    JWT.verify(token, key || 'secret', (err, user) => {
        if (err) return res.sendStatus(403);
        GuideModel.findOne({ email: user.email }).then((result) => {
            // console.log(result)
            if (result.length === 0) {
                return res.sendStatus(401);
            }
            next();
        }).catch((err) => {
            console.error(err);
            return res.sendStatus(500);
        });
    });
}

router.get('/travellers/:username', authenticateToken, (req, res) => {
    GuideModel.findOne({ username: req.params.username }).then((result) => {
        if (!result || !result.tours || !result.tours.assigned_tours) {
            return res.status(404).json({ message: 'No tours found for this guide' });
        }

        const tourIds = result.tours.assigned_tours;
        const travellerPromises = tourIds.map((id) =>
            TravellerModel.find({ tour_id: id })
        );

        // Wait for all TravellerModel.find promises to resolve
        Promise.all(travellerPromises)
            .then((travellers) => {
                res.status(200).json(travellers.flat()); // flatten array if needed
            })
            .catch((err) => {
                console.error(err);
                res.sendStatus(500);
            });
    }).catch((err) => {
        console.error(err);
        res.sendStatus(500);
    });
});


router.get('/tour/:username', authenticateToken, (req, res) => {
    //sending tour schedule
    // console.log(req.params.username);
    var tour_id;
    GuideModel.find({ username: req.params.username }).then((result) => {
        tour_id = result[0].tours.assigned_tours;
        TourModel.find({ tour_id: tour_id }).then((result) => {
            // console.log(result)

            res.status(200).json(result);
        }).catch((err) => {
            console.error(err);
            return res.sendStatus(500);
        });
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });

})
router.get(
    '/guide/:username', authenticateToken, (req, res) => {
        // console.log(req.params.username)
        GuideModel.find({ username: req.params.username }).then((result) => {
            // console.log(result)
            res.status(200).json(result);
        }).catch((err) => {
            console.error(err);
            return res.sendStatus(500);
        });
    })
router.post('/send-whatsapp',authenticateToken, (req, res) => {
    const { message, recipients } = req.body;
    const promises = recipients.map((recipient) =>
        client.messages.create({
            body: message,
            from:`whatsapp:+14155238886`, // Your Twilio WhatsApp number
            to: `whatsapp:+91${7075645401}`, // Number to send WhatsApp message to
        })
    );
    Promise.all(promises)
        .then((results) => res.status(200).json({ success: true, results }))
        .catch((error) => {res.status(500).json({ success: false, error });console.log(error)});
});
module.exports = router;