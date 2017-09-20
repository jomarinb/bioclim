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
  })
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);
