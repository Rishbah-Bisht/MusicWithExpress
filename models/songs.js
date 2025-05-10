const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
name:String,
src:String,
img:String,
artist:String,
priorty: {
    type: String,
    enum: ['High', 'low'],
    default: 'low'
  }
});

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
