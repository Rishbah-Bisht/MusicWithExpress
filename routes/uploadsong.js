const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadsSongs');
const Album = require('../models/album');  
const Song = require('../models/songs');  

router.post('/upload-album', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'songs', maxCount: 40 }
]), async (req, res) => {
  try {
    const { title, description,Artist } = req.body;
    const songNames = req.body.songNames;
    const artists = req.body.artists;
    const durations = req.body.durations;
    const songFiles = req.files['songs'];
    const coverImage = req.files['coverImage'][0];

    const songs = songFiles.map((file, index) => ({
      name: songNames[index],
      artist: artists[index],
      filePath: '/uploads/songs/' + file.filename
    }));

    const album = new Album({
      title,
      Artist,
      description,
      coverImage: '/uploads/covers/' + coverImage.filename,
      songs
    });

    await album.save();
    res.send('Album uploaded successfully!');
  } catch (err) {
    res.status(500).send('Upload failed: ' + err.message);
  }
});



router.post(
  "/upload-song",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { title, artist,mainArtist } = req.body;
      const coverImage = req.files["coverImage"]?.[0]?.path;
      const audioFile = req.files["audioFile"]?.[0]?.path;

      if (!title || !artist || !coverImage || !audioFile) {
        return res.status(400).send("Missing required fields");
      }

      const newSong = new Song({
        title,
        artist,
        mainArtist,
        coverImage,
        audioFile
      });

      await newSong.save();
      res.send("Song uploaded successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
