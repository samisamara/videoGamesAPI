const { application, response } = require('express');
const express = require('express');
const app = express();
const apicalypse = require("apicalypse")
const axios = require("axios");

// igdb.com auth tokens
const client_id = "lxfuzmuilua8gb13ipcikeg8i65ou6";
const client_secret = "lt1lt769d03a4cyh7ta43ovu5zuin8";

const access_token = "kaudhxpfacfryczrbsp95s15uaqbe0";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


// register view engine
app.set('view engine', 'ejs');
app.listen(3000);

app.use((req, res, next) => {
  // console.log('log thing');
  next();
});

// routes
app.get('/', (req, res) => {
  res.render('index', { title: "Home", games: "" });
});

app.post('/', (req, res) => {
  const searchterm = req.body.searchTerm;
  // console.log("We searched for: " + searchterm);
  const releaseDates = [];
  const companies = [];
  axios({
    url: 'https://api.igdb.com/v4/games',
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Client-ID': client_id,
        'Authorization': `Bearer ${access_token}`,
    },
    data: `fields id,name,summary,release_dates.human,cover.url,involved_companies.company.name; search "${searchterm}"; limit 50; where cover.url != null;`
  })
    .then(response => {
      const collections = response.data;
      collections.forEach(collection => {
        collection.cover.url = collection.cover.url.replace('t_thumb', 't_1080p');
        const releaseDate = collection?.release_dates?.[0] ?? 'No release date.'
        releaseDates.push(releaseDate);
        const company = collection?.involved_companies?.[0].company.name ?? 'No Companies found.'
        companies.push(company);
      });
      
      res.render('index', { title: "Home", searchterm, games: collections, releaseDates, companies })
    })
    .catch(err => {
      console.error(err);
    });
});

app.get('/gameList', (req, res) => {
  res.render('gameList', { title: "List of Games" })
});

// post handler

app.get('/gameDetails', (req, res) => {
  res.render('gameDetails', { title: "Game Details" })
});

app.use((req, res) => {
  res.status(404).render('404', { title: "404" })
});