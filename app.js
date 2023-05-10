const { application, response } = require('express');
const express = require('express');
const cors = require('cors');
const app = express();
const apicalypse = require("apicalypse")
const axios = require("axios");
const { render } = require('ejs');

// igdb.com auth tokens
const client_id = "lxfuzmuilua8gb13ipcikeg8i65ou6";
const client_secret = "lt1lt769d03a4cyh7ta43ovu5zuin8";

const access_token = "kaudhxpfacfryczrbsp95s15uaqbe0";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


// register view engine
app.set('view engine', 'ejs');
app.listen(3000);
app.use(cors());

// routes
app.get('/', (req, res) => {
  res.render('index', { title: "Home", games: "" });
});

app.post('/', (req, res) => {
  const searchterm = req.body.searchTerm;
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
    data: `fields id,name,release_dates.human,cover.url,involved_companies.company.name; search "${searchterm}"; limit 50; where cover.url != null & rating != null;`
  })
    .then(response => {
      const collections = response.data;
        collections.forEach(collection => {
          collection.cover.url = collection.cover.url.replace('t_thumb', 't_1080p');
          // optional chaining and nullish coalescing operator
          const releaseDate = collection?.release_dates?.[0] ?? 'No release date.'
          releaseDates.push(releaseDate);
          const company = collection?.involved_companies?.[0].company.name ?? 'No Companies found'
          companies.push(company);
        });
      res.render('index', { title: "Home", searchterm, games: collections, releaseDates, companies });
    })
    .catch(err => {
      console.error(err);
    });
});

app.post('/gameDetails/:id', (req, res) => {
  const game_id = req.params.id;
  axios({
    url: "https://api.igdb.com/v4/games",
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Client-ID': client_id,
        'Authorization': `Bearer ${access_token}`,
    },
    data: `fields id,name,summary,platforms.name,rating,release_dates.human,cover.url,involved_companies.company.name,screenshots.url,artworks.url; where id = ${game_id};`
  })
    .then(response => {
      const game = response.data[0];
      // check if ratings exists
      const ratingCheck = game?.rating ?? 'none';
      if (ratingCheck != 'none') {
        game.rating = game.rating.toFixed(1);
      };
      // change cover url to use the 1080p version
      game.cover.url = game.cover.url.replace('t_thumb', 't_1080p');
      // check if there are any platforms available
      const platformsLength = game.platforms?.length ?? 0;
      // check if there are any publishers available
      const publishersLength = game.involved_companies?.length ?? 0;
      // check if there are any release dates available
      const releaseDateLength = game.release_dates?.length ?? 0;
      // check if there are any available screenshots
      const screenshotsLength = game.screenshots?.length ?? 0;
      // check if there are any available artworks
      const artworksLength = game.artworks?.length ?? 0;

      for (let i=0; i<screenshotsLength; i++) {
        game.screenshots[i].url = game.screenshots[i].url.replace('t_thumb', 't_1080p');
      }

      for (let i=0; i<artworksLength; i++) {
        game.artworks[i].url = game.artworks[i].url.replace('t_thumb', 't_1080p');
      }



      res.render('gameDetails', { title: "Details", game, ratingCheck, platformsLength, publishersLength, releaseDateLength, screenshotsLength, artworksLength });
    })
    .catch(err => {
        console.error(err);
    });
});

app.get('/whatToPlay', (req, res) => {
  res.render('whatToPlay', { title: "What To Play" });
});

app.post('/whatToPlay', (req, res) => {

  let currentDate = new Date();
  let parsedCurrent = currentDate.getTime();
  let tester = new Date(1610132229000);
  tester = tester/1000;

  // finds the exact date/time from 1 year ago and 3 years ago
  let oneYearAgo = Math.round((parsedCurrent - 31556952000)/1000);
  let threeYearsAgo = Math.round((parsedCurrent - 94670856000)/1000);

  // finds selected choice for age setting and constructs a piece of the request based on the chosen option
  let ageSetting = `first_release_date != null`
  if (req.body.ageOption == "inOneYear") {
    ageSetting = ageSetting + ` & first_release_date > ${oneYearAgo} & first_release_date > ${threeYearsAgo};`
  } else if (req.body.ageOption == "inThreeYears") {
    ageSetting = ageSetting + ` & first_release_date < ${oneYearAgo} & first_release_date > ${threeYearsAgo};`
  } else if (req.body.ageOption == "older") {
    ageSetting = ageSetting + ` & first_release_date < ${threeYearsAgo};`
  } else {
    ageSetting = ageSetting + `;`
  }

  let genreOption = req.body.genreOption;
  let themeOption = req.body.themeOption;

  if ((genreOption.includes("none"))) {
    genreOption = ``;
  } else {
    genreOption = ` & genres = [${genreOption}]`;
  }

  if ((themeOption.includes("none"))) {
    themeOption = ``;
  } else {
    themeOption = ` & themes = [${themeOption}]`;
  }

  // construct body of API request
  const dataBody = `fields id, name, first_release_date, genres, genres.name, themes, themes.name, genres.name, release_dates.human,cover.url,involved_companies.company.name; limit 50; where cover.url != null${genreOption}${themeOption} & ${ageSetting}`;

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
    data: dataBody
  })
    .then(response => {
      const collections = response.data;
        collections.forEach(collection => {
          collection.cover.url = collection.cover.url.replace('t_thumb', 't_1080p');
          // optional chaining and nullish coalescing operator
          const releaseDate = collection?.release_dates?.[0] ?? 'No release date.'
          releaseDates.push(releaseDate);
          const company = collection?.involved_companies?.[0].company.name ?? 'No Companies found'
          companies.push(company);
        });
      res.render('listResults', { title: "What To Play - Results", games: collections, releaseDates, companies });
    })
    .catch(err => {
      console.error(err);
    });
});

app.use((req, res) => {
  res.status(404).render('404', { title: "404" });
});