const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadsSongs');
const Album = require('../models/album');  

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




router.post('/upload-song')
module.exports = router;
