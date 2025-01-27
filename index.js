const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
let port = 3000;

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});



// Serve static files
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use('/music', express.static(path.join(__dirname, 'music')));
app.use('/picture', express.static(path.join(__dirname, 'picture')));
// Set EJS as the view engine (remove the "json" view engine)
app.set("view engine", "ejs");




app.set("views", path.join(__dirname, "/views"));




app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => {
    fs.readFile(path.join(__dirname, './data/data.json'), 'utf8', (err, data) => {
        const instaData = JSON.parse(data);
        res.render('home', { instaData });
    });

});



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

            // Extract valid data or use empty objects for failed files
            const songsData = songsResult.status === 'fulfilled' ? songsResult.value : {};
            const singerData = singerResult.status === 'fulfilled' ? singerResult.value : {};
            const albumData = albumResult.status === 'fulfilled' ? albumResult.value : {};

            // Search logic
            if (songsData[songname]) {
                return res.render('song', { key: songname, data: songsData[songname] });
            } else if (albumData[songname]) {
                return res.render('song', { key: songname, data: albumData[songname] });
            } else if (singerData[songname]) {
                return res.render('singer', { key: songname, data: singerData[songname] });
            } else {
                return res.send('No such song, album, or singer found.');
            }
        })
        .catch(err => {
            console.error('Error processing request:', err);
            return res.status(500).send('Internal Server Error. Please try again later.');
        });
});






app.get('/search-suggestions', (req, res) => {
    const query = req.query.username || '';
    fs.readFile(path.join(__dirname, './data/songs.json'), 'utf8', (err, songs) => {
        if (err) {
            return res.status(500).send('Error reading data file');
        }

        const instaData = JSON.parse(songs);
        const suggestions = Object.keys(instaData).filter(username => username.toLowerCase().startsWith(query.toLowerCase()));

        res.json(suggestions);
    });
});


app.get('/data', (req, res) => {
    fs.readFile(path.join(__dirname, './data/songs.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data file');
        }
        res.json(JSON.parse(data));
    });
});


app.get('/songs', (req, res) => {
    console.log("Received request for songs");
    const songs = require('./data/songs.json');
    const album = require('./data/album.json');
    const singer = require('./data/singer.json');
    res.json({ songs, album, singer });
});





