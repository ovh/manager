angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicated.server.dashboard.ovh-tasks', {
      url: '/ovh-tasks',
      views: {
        'tabView@app.dedicated.server': {
          component: 'dedicatedServerOVHTasks',
        },
      },
      translations: { value: ['../ovh-tasks'], format: 'json' },
    });
  },
);
