const { application } = require('express');
const express = require('express');
const app = express();
const apicalypse = require("apicalypse");

// connect to database
const dbURI = "";

// igdb.com auth tokens
const client_id = "lxfuzmuilua8gb13ipcikeg8i65ou6";
const client_secret = "lt1lt769d03a4cyh7ta43ovu5zuin8";

const access_token = "kaudhxpfacfryczrbsp95s15uaqbe0";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// base URL
const baseURL = "https://api.igdb.com/v4"


// register view engine
app.set('view engine', 'ejs');
app.listen(3000);

app.use((req, res, next) => {
  console.log('log thing');
  next();
});

// routes
app.get('/', (req, res) => {
  res.render('index', { title: "Home" });
});

app.get('/gameList', (req, res) => {
  res.render('gameList', { title: "List of Games" })
});

// post handler
app.post('/gameList', (req, res) => {
  console.log(req.body);
  



});

app.get('/gameDetails', (req, res) => {
  res.render('gameDetails', { title: "Game Details" })
});

app.use((req, res) => {
  res.status(404).render('404', { title: "404" })
});