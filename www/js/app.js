// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })



  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
      })
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
      .state('app.dohod', {
        url: '/dohod',
        views: {
          'menuContent': {
            templateUrl: 'templates/dohod.html',
            controller: 'BarCtrl'
          }
        }
      })
      .state('app.plan', {
        url: '/plan',
        views: {
          'menuContent': {
            templateUrl: 'templates/plan.html',
            controller: 'PlanCtrl'
          }
        }
      })
      .state('app.ocenka', {
        url: '/ocenka',
        views: {
          'menuContent': {
            templateUrl: 'templates/ocenka.html',
            controller: 'OcenkaCtrl'
          }
        }
      })
      .state('app.ispolnenie', {
        url: '/ispolnenie',
        views: {
          'menuContent': {
            templateUrl: 'templates/ispolnenie.html',
            controller: 'IspolnenieCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  });
