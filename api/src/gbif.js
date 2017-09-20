const common = require('./common');

const gbifSpeciesSearchUrl = 'http://api.gbif.org/v1/species/search?limit=1&q=';
const gbifOccurrenceSearchUrl = 'https://api.gbif.org/v1/occurrence/search?hasCoordinate=true&limit=1000&q='


module.exports.searchSpecies = function(query) {
  const url = gbifSpeciesSearchUrl + encodeURIComponent(query);
  return common.httpGet(url).then(function (res) {
    if (res.results && res.results.length > 0) {
      return res.results[0];
    }
    throw new Error('No results');
  });
};

module.exports.searchOccurrences = function (query) {
  const url = gbifOccurrenceSearchUrl + query;
  return common.httpGet(url).then(function (res) {
    if (res.results && res.results.length > 0) {
      return res.results.map(function (entry) {
        return [entry['decimalLatitude'], entry['decimalLongitude']];
      });
    }
    throw new Error('No results');
  });
};
