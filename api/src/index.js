const express = require('express');
const request = require('request');
const bioclim = require('./bioclim');
const app = express();

const gbifSpeciesSearchUrl = 'http://api.gbif.org/v1/species/search?limit=1&q=';
const gbifOccurrenceSearchUrl = 'https://api.gbif.org/v1/occurrence/search?hasCoordinate=true&limit=100&nubKey='

bioclim.loadDatasets('./data');

app.get('/search', function (req, res) {
  const searchTerm = req.query['q'];
  if (!searchTerm || searchTerm === '') {
    res.sendStatus(400);
    return;
  }
  const searchUrl = gbifSpeciesSearchUrl + encodeURIComponent(searchTerm);
  request(searchUrl, function (error, response, body) {
    if (error !== null) {
      res.sendStatus(404);
      return;
    }
    body = JSON.parse(body);
    if (!body.results || body.results.length === 0) {
      res.sendStatus(404);
      return;
    }
    const gbifData = body.results[0];
    const data = {
      gbif: gbifData,
      values: {}
    };
    const occurenceSearchUrl = gbifOccurrenceSearchUrl + gbifData['nubKey'];
    request(occurenceSearchUrl, function (error, response, body) {
      if (error === null) {
        body = JSON.parse(body);
        var coordinates = body.results.map(function (entry) {
          return [entry['decimalLatitude'], entry['decimalLongitude']];
        });
        data.values = bioclim.getValues(coordinates);
      }
      res.status(200).send(data);
    });


  });

});

app.listen(3000, function () {
  console.log('Listening on port 3000!')
});

'http://api.gbif.org/v1/occurrence/search?datasetKey=datasetKey&hasCoordinate=true'

"/api/species/2435098/occurencedatasets?limit=10&offset=0"
