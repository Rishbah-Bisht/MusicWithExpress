const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const port = process.env.PORT || 3200;

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use('/music', express.static(path.join(__dirname, 'music')));
app.use('/picture', express.static(path.join(__dirname, 'picture')));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

mongoose.connect('mongodb://localhost:27017/MrxciTecH')
    .then(() => console.log("✅ MongoDB connected successfully!"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/MrxciTecH',
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false
    }
}));

app.get("/", (req, res) => {
    fs.readFile(path.join(__dirname, './data/data.json'), 'utf8', (err, data) => {
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

module.exports = app;
