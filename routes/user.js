const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const user = require("../models/users");
const crypto = require("crypto");





// Helper to ensure user is logged in
function ensureLoggedIn(req, res, next) {
    if (!req.session.user || !req.session.user.id) {
        return res.redirect('/Musicfy/logout');
    }
    next();
}







// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/Profile");
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, bytes) {
            const fn = bytes.toString("hex") + path.extname(file.originalname);
            cb(null, fn);
        });
    },
});

const upload = multer({ storage: storage });







// Check if username already exists
router.get('/check-username', async (req, res) => {
    const username = req.query.username;
    const userExists = await user.findOne({ userName: username });
    res.json({ exists: !!userExists });
});






// Render profile page
router.get('/Musicfy/profile', ensureLoggedIn, async (req, res) => {
    const user_info = await user.findById(req.session.user.id);
    res.render('profile.ejs', { user_info });
});




// Render home page (empty for now)
router.get('/Musicfy/Home', ensureLoggedIn, async (req, res) => {
    try {
        res.render("home");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading home data.');
    }
});




// Update user info (name, bio, profile image)
router.post('/Update-user-info', ensureLoggedIn, upload.single('p_img'), async (req, res) => {
    const updates = {
        name: Array.isArray(req.body.name) ? req.body.name[0] : req.body.name,
        bio: req.body.bio
    };

    if (req.file) {
        updates.img = '/uploads/Profile/' + req.file.filename;
    }

    try {
        const updatedUser = await user.findByIdAndUpdate(
            req.session.user.id,
            { $set: updates },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.redirect('/Musicfy/profile');
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).send('Server error while updating user');
    }
});


module.exports = router;
