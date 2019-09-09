angular
  .module('App')
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('app.dedicated.server.dashboard.ovh-tasks', {
      url: '/ovh-tasks',
      component: 'dedicatedServerOVHTasks',
      translations: { value: ['../ovh-tasks'], format: 'json' },
    });
  });
