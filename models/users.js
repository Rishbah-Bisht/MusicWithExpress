const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true},
    password: {
        type: String,
        default: ""
    },
    userName:String,
    profession:String,
    img:String,
    bio:String
});

module.exports = mongoose.model('User', userSchema);

