angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicated-server.server.dashboard.ovh-tasks', {
      url: '/ovh-tasks',
      redirectTo: 'app.dedicated-server.server.dashboard',
    });
  },
);
