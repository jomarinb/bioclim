const express = require('express');
const cors = require('cors');
const bioclim = require('./bioclim');
const app = express();

const gbifSpeciesSearchUrl = 'http://api.gbif.org/v1/species/search?limit=1&q=';
const gbifOccurrenceSearchUrl = 'https://api.gbif.org/v1/occurrence/search?hasCoordinate=true&limit=100&nubKey='

bioclim.loadDatasets('./data');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
    return gbif.searchOccurrences(result.gbif.nubKey);
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
