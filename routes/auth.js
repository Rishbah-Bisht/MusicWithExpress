const express = require("express");
const session = require("express-session");
const router = express.Router();
const bcrypt = require("bcrypt");
const song = require("../models/songs");
const user = require("../models/users");
const sendOTPEmail  = require('../tests/sendOTPEmail');

// ✅ Import Middleware
const ensureAuth = require("../middleware/auth");

router.get('/Musicfy/sing-up', async (req, res) => {
    res.render("signUp.ejs");
})



router.post('/Musicfy/sing-up/post', async (req, res) => {
    const { user_email, user_name } = req.body;

    const newUser = new user({
        name: user_name,
        email: user_email,
    });

    try {
        await newUser.save();

        const otp = generateOTP();
        console.log("Generated OTP:", otp);

        await sendOTPEmail({
            to: user_email,
            name: user_name,
            otp
        });

        res.status(200).send("Signup successful. OTP sent to email.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong.");
    }

    function generateOTP(length = 4) {
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += Math.floor(Math.random() * 10);
        }
        return otp;
    }


    res.send('done')
});














router.get("/logout", ensureAuth, (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;
