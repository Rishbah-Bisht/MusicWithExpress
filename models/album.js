const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  name: String,
  artist: String,
  duration: Number,
  filePath: String
});

const albumSchema = new mongoose.Schema({
  title: String,
  Artist: String,
  description: String,
  coverImage: String,
  songs: [songSchema]
});

module.exports = mongoose.model('Album', albumSchema);
