const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: [true, 'Song must belong to an album']
  },
  trackNumber: {
    type: Number,
    min: 1
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  file: {
    path: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    size: {
      type: Number, // in bytes
      required: true
    },
    format: {
      type: String,
      enum: ['mp3', 'wav', 'ogg', 'm4a'],
      required: true
    }
  },
  plays: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
songSchema.index({ album: 1, trackNumber: 1 });
songSchema.index({ title: 'text' });

const Song = mongoose.model('Song', songSchema);

module.exports = Song;