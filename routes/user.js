const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.get("/", (req, res) => {
    fs.readFile(path.join(__dirname, '../data/data.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading data file.');
        
        const instaData = JSON.parse(data);
        const homeData = {
            TopArtists: Object.values(instaData.TopArtists),
            JumpBackIn: Object.values(instaData.JumpBackIn),
            TopAlbums: Object.values(instaData.TopAlbums)
        };
        res.render("home", { instaData: homeData });
    });
});

function getValueBeforeComma(str) {
    if (!str) return '';
    return str.includes(",") ? str.split(",")[0].trim() : str.trim();
}

module.exports = router;
