const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const user = require("../models/users");
const crypto = require("crypto");
const Album_data = require('../models/album')
const Song_data = require('../models/songs');
const UserLikedSong = require('../models/UserLikedSongs');


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

        const albums = await Album_data.find();
        const songs = await Song_data.find();
        const users_data = await user.find();
        const likedSong = await UserLikedSong.find({ userId: req.session.user.id });
        res.render("home", { albums, songs, likedSong, users_data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading home data.');
    }
});


router.get('/Musicfy/Artist/:artistName', ensureLoggedIn, async (req, res) => {
    try {
        const artistName = req.params.artistName;
        const user_info = await user.findOne({ userName: artistName });
        console.log(user_info)

        const likedSong = await UserLikedSong.find({ userId: req.session.user.id });
        const Songs = await Song_data.find({ mainArtist: artistName });
        const albums = await Album_data.find({ mainArtist: artistName });

        if (!Songs) {
            return res.status(404).send('Songs not found.');
        }
        if (!albums) {
            return res.status(404).send('Album not found.');
        }
        res.render('ArtistPage', { Songs, albums, user_info, likedSong })
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading album data.');
    }
});



router.get('/Musicfy/Uploads-Music', ensureLoggedIn, async (req, res) => {
    try {
        res.render("uploadAlbum");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading home data.');
    }
});

router.get('/Musicfy/create-playlist', (req, res) => {
    res.render('Create_playlist')
})

router.get('/Musicfy/create-playlist/Add-Album', (req, res) => {
    res.render('uploadAlbum')
})

router.get('/Musicfy/create-playlist/Add-Single-Song', async (req, res) => {
    const user_info = await user.findById(req.session.user.id);
    res.render('uploadAingleSong', { user_name: user_info.userName })
})



// Update user info (name, bio, profile image)
router.post('/Update-user-info', ensureLoggedIn, upload.single('p_img'), async (req, res) => {
    const updates = {
        name: req.body.nickname,
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







router.get('/Musicfy/Album/:albumname', ensureLoggedIn, async (req, res) => {
    try {
        const albumName = req.params.albumname;

        const album = await Album_data.findOne({ title: albumName });
        const likedSong = await UserLikedSong.find({ userId: req.session.user.id });
        if (!album) {
            return res.status(404).send('Album not found.');
        }

        res.render("album", { album, likedSong });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading album data.');
    }
});










































module.exports = router;
