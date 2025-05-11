const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const users = require('./routes/user');
const auth = require('./routes/auth');
const flash = require('connect-flash');



const port = process.env.PORT || 3200;

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use('/music', express.static(path.join(__dirname, 'music')));
app.use('/picture', express.static(path.join(__dirname, 'picture')));
app.use('/uploads', express.static('uploads')); 
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

app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});



app.use('/', users);
app.use('/', auth);




module.exports = app;
