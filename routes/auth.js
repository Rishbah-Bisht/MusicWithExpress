const express = require("express");
const session = require("express-session");
const router = express.Router();
const bcrypt = require("bcrypt");
const song = require("../models/songs");
const user = require("../models/users");
const sendOTPEmail = require('../tests/sendOTPEmail');

// ✅ Import Middleware
const ensureAuth = require("../middleware/auth");

router.get('/Musicfy/sing-up', async (req, res) => {
    res.render("signUp.ejs");
})


async function loadUserData(req, res, next) {
    try {
        const user_db_ID = req.session.user?.id;

        if (!user_db_ID) {
            return res.redirect('/Musicfy/login');
        }

        const user_data = await user.findById(user_db_ID);
        if (!user_data) {
            return res.redirect('/Musicfy/login');
        }

        req.user_data = user_data;
        next();
    } catch (err) {
        console.error('Error loading user data:', err);
        res.redirect('/Musicfy/login');
    }
}


// ---------- Signup Route ----------
router.post('/Musicfy/sing-up/post', async (req, res) => {
    const { user_email, user_name } = req.body;

    try {
        const userInfo = await user.findOne({ email: user_email });
        // if (userInfo) {
        //     return res.send("User already exists.");
        // }

        const newUser = new user({
            name: user_name,
            email: user_email,
        });

        await newUser.save();
        const otp = generateOTP();

        await sendOTPEmail({
            to: user_email,
            name: user_name,
            otp
        });

        // Save session
        req.session.user = {
            id: newUser._id,
            username: newUser.name,
            email: newUser.email
        };

        // Save OTP to session for verification
        req.session.otp = otp;


        res.render('verifyOTP', { user_email, user_name, otp });
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
});

// ---------- OTP Verification Route ----------
router.post('/Musicfy/verify-otp', (req, res) => {
    const { user_otp } = req.body;
    const session_otp = req.session.otp;

    if (!user_otp || !session_otp) {
        return res.status(400).send("Missing OTP information.");
    }

    if (user_otp === session_otp) {
        req.flash('success_msg', 'Sign-Up successfully!');
        res.redirect('/Musicfy/set-password');
    } else {
        res.send('❌ Invalid OTP. Please try again.');
    }
});

// ---------- Password Setup Page ----------
router.get('/Musicfy/set-password', ensureAuth, loadUserData, async (req, res) => {
    res.render('setPassword', { user: req.user_data });
});

// ---------- Password Setup Page ----------
router.post('/Musicfy/set-password', async (req, res) => {
    const { set_password, username, music_professions } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(set_password, 10);

        const updatedUser = await user.findByIdAndUpdate(
            req.session.user.id,
            {
                password: hashedPassword,
                userName: username,
                profession: music_professions,
            },
            { new: true }
        );
        req.flash('success_msg', 'Sign-Up successfully!');
        res.redirect('/Musicfy/Home');

    } catch (err) {

    }
});






// ------------------------------------Login---------------------------------------

router.get('/Musicfy/login', (req, res) => {
    res.render('loginPage.ejs')
})

router.post('/Musicfy/login/post', async (req, res) => {
    const { Registration_email, password } = req.body;
    try {
        const user_data = await user.findOne({ userName: Registration_email });
        if (!user_data) {
            req.flash('error_msg', 'No account found. Please sign up first.');
            return res.redirect('/Musicfy/login');
        }

        const isMatch = await bcrypt.compare(password, user_data.password);
        if (!isMatch) {
            req.flash('error_msg', 'Wrong password');
            return res.redirect('/Musicfy/login');
        }

        // Store user session after successful login
        req.session.user = {
            id: user_data._id,
            email: user_data.email,
            userUniquename: user_data.userName
        };

        res.redirect('/Musicfy/Home');
    } catch (err) {
        console.error('Login error:', err);
        req.flash('error_msg', 'Server error during login.');
        res.redirect('/Musicfy/login');
    }
});































router.get("/Musicfy/logout", ensureAuth, (req, res) => {
    req.session.destroy(() => {
        res.redirect("/Musicfy/login");
    });
});

module.exports = router;
