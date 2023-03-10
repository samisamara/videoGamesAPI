const express = require('express');
const app = express();

// connect to database
const dbURI = "";

// register view engine
app.set('view engine', 'ejs');
app.listen(3000);

app.use(express.static("public"));

// routes
app.get('/', (req, res) => {
  res.render('index', { title: "Home" });
});

app.use((req, res) => {
  res.status(404).render('404', { title: "404" })
});