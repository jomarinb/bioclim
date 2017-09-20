const common = require('./common');

const eolSpeciesSearchUrl = 'http://eol.org/api/search/1.0.json?page=1&exact=false&q=';
const eolPagesUrl = 'http://eol.org/api/pages/1.0.json?batch=false&images_per_page=1&images_page=1&videos_per_page=0&videos_page=0&sounds_per_page=0&sounds_page=0&maps_per_page=0&maps_page=0&texts_per_page=0&texts_page=0&subjects=overview&licenses=all&details=true&common_names=false&synonyms=false&references=false&taxonomy=false&vetted=0&cache_ttl=&language=en&id=';

module.exports.searchSpecies = function(query) {
  const url = eolSpeciesSearchUrl + encodeURIComponent(query);
  return common.httpGet(url).then(function (res) {
    if (res.results && res.results.length > 0) {
      return res.results[0];
    }
    throw new Error('No results');
  });
};

module.exports.getImageData = function(query) {
  return module.exports.searchSpecies(query).then(function (eolData) {
    const url = eolPagesUrl + eolData.id;
    return common.httpGet(url).then(function (res) {
      if (res.dataObjects && res.dataObjects.length > 0) {
        const imageData = res.dataObjects[0];
        return {
          width: imageData.width,
          height: imageData.height,
          mimeType: imageData.mimeType,
          url: imageData.mediaURL
        };
      }
      throw new Error('No results');
    });
  });
};
