'use strict';

/**
 * @ngdoc overview
 * @name bioclimDemoApp
 * @description
 * # bioclimDemoApp
 *
 * Main module of the application.
 */
angular
  .module('bioclimDemoApp', [
    'ngResource',
    'ngRoute',
    'ng-fusioncharts'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
