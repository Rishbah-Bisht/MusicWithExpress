const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  mainArtist: {
    type: String,
    required: true,
    required: true,
  },
  coverImage: {
    type: String, // URL or path to the cover image
    required: true
  },
  audioFile: {
    type: String, // URL or path to the audio file
    required: true
  },
});

module.exports = mongoose.model("Song", SongSchema);
