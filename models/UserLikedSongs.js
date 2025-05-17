// models/UserLikedSongs.js
const mongoose = require('mongoose');

const UserLikedSongSchema = new mongoose.Schema({
  userId: String,
  songSrc: String,
  title: String,
  artist: String,
  img: String,
  likedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserLikedSong", UserLikedSongSchema);
