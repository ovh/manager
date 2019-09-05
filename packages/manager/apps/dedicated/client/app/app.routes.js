angular
  .module('App')
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app', {
      abstract: true,
      resolve: {
        currentUser: /* @ngInject */ User => User.getUser(),
      },
      templateUrl: 'app.html',
      translations: { value: ['common', 'double-authentication', 'user-contracts'], format: 'json' },
      url: '',
    });

    // CDN & NAS
    $stateProvider.state('app.networks', {
      abstract: true,
      template: '<ui-view />',
      url: '/configuration',
    });

    // Microsoft
    $stateProvider.state('app.microsoft', {
      abstract: true,
      template: '<ui-view />',
    });
  });
