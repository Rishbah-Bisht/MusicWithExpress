const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Use the port provided by Render or default to 3000 for local development
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use('/music', express.static(path.join(__dirname, 'music')));
app.use('/picture', express.static(path.join(__dirname, 'picture')));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Middleware for parsing URL-encoded data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    fs.readFile(path.join(__dirname, './data/data.json'), 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading data file:", err);
            return res.status(500).send('Error reading data file.');
        }
        const instaData = JSON.parse(data);
        res.render('home', { instaData });
    });
});


function getValueBeforeComma(str) {
    if (!str) return ''; // Handle undefined or null values
    return str.includes(",") ? str.split(",")[0].trim() : str.trim();
}
// Song details route
app.get('/song', (req, res) => {
    const songname = req.query.songname;

    const readFile = (filePath) => {
        return fs.promises.readFile(filePath, 'utf8').then(data => JSON.parse(data));
    };

    Promise.allSettled([
        readFile(path.join(__dirname, './data/songs.json')),
        readFile(path.join(__dirname, './data/singer.json')),
        readFile(path.join(__dirname, './data/album.json'))
    ])
        .then(results => {
            const [songsResult, singerResult, albumResult] = results;

            const songsData = songsResult.status === 'fulfilled' ? songsResult.value : {};
            const singerData = singerResult.status === 'fulfilled' ? singerResult.value : {};
            const albumData = albumResult.status === 'fulfilled' ? albumResult.value : {};

            // Search logic
            if (songsData[songname]) {
                return res.render('song', { key: songname, data: songsData[songname],getValueBeforeComma });
            } else if (albumData[songname]) {
                return res.render('song', { key: songname, data: albumData[songname],getValueBeforeComma });
            } else if (singerData[songname]) {
                return res.render('singer', { key: songname, data: singerData[songname],getValueBeforeComma });
            } else {
                return res.render('error');
            }
        })
        .catch(err => {
            console.error('Error processing request:', err);
            return res.status(500).send('Internal Server Error. Please try again later.');
        });
});

// Search suggestions route
app.get('/search-suggestions', (req, res) => {
    const query = req.query.username || '';
    fs.readFile(path.join(__dirname, './data/songs.json'), 'utf8', (err, songs) => {
        if (err) {
            console.error("Error reading songs data:", err);
            return res.status(500).send('Error reading songs data.');
        }

        const instaData = JSON.parse(songs);
        const suggestions = Object.keys(instaData).filter(username => username.toLowerCase().startsWith(query.toLowerCase()));
        res.json(suggestions);
    });
});

// Route to serve all song data
app.get('/data', (req, res) => {
    fs.readFile(path.join(__dirname, './data/songs.json'), 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading data file:", err);
            return res.status(500).send('Error reading data file.');
        }
        res.json(JSON.parse(data));
    });
});


// Route to serve all songs, albums, and singers
app.get('/songs', (req, res) => {
    console.log("Received request for songs");
    try {
        const songs = require('./data/songs.json');
        const album = require('./data/album.json');
        const singer = require('./data/singer.json');
        res.json({ songs, album, singer });
    } catch (err) {
        console.error("Error loading song data:", err);
        res.status(500).send('Error loading song data.');
    }
});

module.exports = app;
