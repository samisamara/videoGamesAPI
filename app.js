const { application } = require('express');
const express = require('express');
const app = express();
const axios = require("axios");

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
  // console.log('log thing');
  next();
});

// routes
app.get('/', (req, res) => {
  res.render('index', { title: "Home" });
});

app.post('/', (req, res) => {
  const searchterm = req.body.searchTerm;
  console.log(searchterm);
  console.log("before making the call")

  axios({
    url: `https://api.igdb.com/v4/games?fields=name&limit=50&search=${searchterm}`,
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Client-ID': client_id,
        'Authorization': `Bearer ${access_token}`,
    },
    data: "fields age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,cover,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_localizations,game_modes,genres,hypes,involved_companies,keywords,language_supports,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites;"
  })
    .then(response => {
        console.log(response.data);
    })
    .catch(err => {
        console.error(err);
    });
    res.render('gameList', { title: "List of Games" })
})

app.get('/gameList', (req, res) => {
  res.render('gameList', { title: "List of Games" })
});

// post handler
app.post('/gameList', (req, res) => {
  // console.log(req.body.searchTerm);
  



});

app.get('/gameDetails', (req, res) => {
  res.render('gameDetails', { title: "Game Details" })
});

app.use((req, res) => {
  res.status(404).render('404', { title: "404" })
});