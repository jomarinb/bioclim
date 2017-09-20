const gdal = require('gdal');
const path = require('path');

// Bioclim file constants (can be read from metadata)
const ULXMAP = -179.9166666666667;
const ULYMAP = 89.91666666666667;
const XDIM = 0.166666666666667;
const YDIM = 0.166666666666667;

datasets = [];

module.exports.loadDatasets = function(dirname) {
  for (var i = 1; i <= 19; i++) {
    const filePath = path.join(dirname, "bio" + i + ".bil");
    const dataset = gdal.open(filePath).bands.get(1);
    datasets.push(dataset);
  }
};

module.exports.getValues = function(points) {
  const result = {};
  for (var i = 0; i < 19; i++) {
    const dataset = datasets[i];
    const measurements = [];
    points.forEach(function (point) {
      var y = (ULYMAP - point[0]) / YDIM;
      var x = (point[1] - ULXMAP) / XDIM;
      x = Math.floor(x) % dataset.size.x;
      y = Math.floor(y) % dataset.size.y;
      const values = dataset.pixels.read(x, y, 1, 1);
      if (values.length > 0 && values[0] !== dataset.noDataValue) {
        measurements.push(values[0]);
      }
    });
    result["bio" + (i + 1)] = measurements;
  }
  return result;
};
