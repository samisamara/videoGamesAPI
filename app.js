const { application } = require('express');
const express = require('express');
const app = express();

// connect to database
const dbURI = "";

// igdb.com auth tokens
const client_id = "lxfuzmuilua8gb13ipcikeg8i65ou6";
const client_secret = "ndwufpkw69w69wdd305caygwcr1v5x";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));



// register view engine
app.set('view engine', 'ejs');
app.listen(3000);



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