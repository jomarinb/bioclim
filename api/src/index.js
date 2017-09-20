const express = require('express');
const cors = require('cors');
const bioclim = require('./bioclim');
const gbif = require('./gbif');
const eol = require('./eol');

// Initialization
const app = express();
bioclim.loadDatasets('./data');

// CORS
const corsOptions = {
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'Origin', 'Accept'],
  exposedHeaders: ['Location'],
  credentials: true,
  origin: function(_origin, callback) {
    // Allow any origin
    callback(null, true);
  }
};
app.use(cors(corsOptions));

app.get('/search', function (req, res) {
  const searchTerm = req.query['q'];
  if (!searchTerm || searchTerm === '') {
    res.sendStatus(400);
    return;
  }
  const result = {};
  gbif.searchSpecies(searchTerm).then(function (gbifData) {
    result.gbif = gbifData;
    return eol.getImageData(searchTerm);
  }).then(function (imgData) {
    result.eol = imgData;
    return gbif.searchOccurrences(searchTerm);
  }).then(function (coordinates) {
    result.values = bioclim.getValues(coordinates);
  }).then(function () {
    res.status(200).send(result);
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(404);
  });
});

app.listen(3000, function () {
  console.log('Listening on port 3000!')
});
