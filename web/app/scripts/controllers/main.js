'use strict';

/**
 * @ngdoc function
 * @name bioclimDemoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bioclimDemoApp
 */
angular.module('bioclimDemoApp')
  .controller('MainCtrl', function ($http, $scope) {
    function init() {
      $scope.activeBioclimVar = {};
      $scope.bioclimData = null;
      $scope.bioclimDataSource = null;
      $scope.searchInputText = "";
      $scope.specie = {};
    };

    $scope.reset = init;

    init();

    $scope.searchSpecie = function () {
      if (!$scope.searchInputText || $scope.searchInputText === "") {
        return;
      }
      $http({
        method: 'GET',
        url: 'http://localhost:3000/search',
        params: {
          q: $scope.searchInputText
        }
      }).then(function successCallback(response) {
        $scope.specie = response.data.gbif;
        $scope.bioclimData = response.data.values;
      }, function errorCallback(response) {
        $scope.bioclimData = null;
        $scope.bioclimDataSource = null;
        console.error(response);
      });
    };

    $scope.bioclimVars = [
      {
        name: "Annual Mean Temperature",
        key: "bio1",
        unit: "Fahrenheit"
      },
      {
        name: "Mean Diurnal Range",
        key: "bio2",
        unit: "Fahrenheit"
      },
      {
        name: "Isothermality",
        key: "bio3",
        unit: "Fahrenheit"
      },
      {
        name: "Temperature Seasonality",
        key: "bio4",
        unit: "Fahrenheit"
      },
      {
        name: "Max Temperature of Warmest Month",
        key: "bio5",
        unit: "Fahrenheit"
      }
    ];


    $scope.setActiveBioclimVar = function (bioclimVar) {
      if ($scope.bioclimData) {
        $scope.bioclimDataSource = null;
        $scope.activeBioclimVar = bioclimVar;
        var parsed = parseBioValues($scope.bioclimData[$scope.activeBioclimVar.key]);
        $scope.activeBioclimVar.categories = parsed.categories;
        $scope.activeBioclimVar.data = parsed.data;
        updateBioclimDataSource();
      }
    };


    function updateBioclimDataSource() {
      $scope.bioclimDataSource = {
        "chart": {
          "caption": $scope.activeBioclimVar.name,
          "subCaption": $scope.activeBioclimVar.key,
          "xAxisName": $scope.activeBioclimVar.unit,
          "yAxisName": "Ocurrence",
          "captionFontSize": "14",
          "subcaptionFontSize": "14",
          "baseFontColor": "#333333",
          "baseFont": "Helvetica Neue,Arial",
          "subcaptionFontBold": "0",
          "paletteColors": "#6baa01,#008ee4",
          "usePlotGradientColor": "0",
          "bgColor": "#ffffff",
          "showBorder": "0",
          "showPlotBorder": "0",
          "showValues": "0",
          "showShadow": "0",
          "showAlternateHGridColor": "0",
          "showCanvasBorder": "0",
          "showXAxisLine": "1",
          "xAxisLineThickness": "1",
          "xAxisLineColor": "#999999",
          "canvasBgColor": "#ffffff",
          "divlineAlpha": "100",
          "divlineColor": "#999999",
          "divlineThickness": "1",
          "divLineIsDashed": "1",
          "divLineDashLen": "1",
          "divLineGapLen": "1",
          "legendBorderAlpha": "0",
          "legendShadow": "0",
          "toolTipColor": "#ffffff",
          "toolTipBorderThickness": "0",
          "toolTipBgColor": "#000000",
          "toolTipBgAlpha": "80",
          "toolTipBorderRadius": "2",
          "toolTipPadding": "5"
        },
        "categories": [
          {
            "category": $scope.activeBioclimVar.categories
          }
        ],
        "dataset": [
          {
            "seriesname": $scope.activeBioclimVar.name,
            "data": $scope.activeBioclimVar.data
          }
        ]
      }
    }

    function parseBioValues(values) {
      var counts = {};
      for (var i = 0; i < values.length; i++) {
        var num = values[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }
      var categories = [];
      var data = [];
      for (var property in counts) {
        if (counts.hasOwnProperty(property)) {
          categories.push({label: property});
          data.push({value: counts[property]});
        }
      }
      return {
        categories: categories,
        data: data
      }
    }
  });
