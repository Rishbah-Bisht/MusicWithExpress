// like.js route
const express = require('express');
const router = express.Router();
const UserLikedSong = require('../models/UserLikedSongs');

router.get('/Musicfy/liked-songs', async (req, res) => {
    const userId = req.session.user.id;
    try {
        const likedSongs = await UserLikedSong.find({ userId: userId });
        res.render('LikedSongPage',{likedSongs})
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
})



router.post('/like-single-song', async (req, res) => {
    const { songSrc, title, artist, img } = req.body;

    const userId = req.session.user.id;
    try {
        const alreadyLiked = await UserLikedSong.findOne({ userId, songSrc });

        if (alreadyLiked) {
            await UserLikedSong.deleteOne({ userId, songSrc });
            return res.json({ liked: false });
        } else {
            await UserLikedSong.create({ userId, songSrc, title, artist, img });
            return res.json({ liked: true });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
