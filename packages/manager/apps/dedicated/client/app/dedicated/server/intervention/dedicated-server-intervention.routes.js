import template from './dedicated-server-intervention.html';

angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicated.server.intervention', {
      url: '/intervention',
      views: {
        'tabView@app.dedicated.server': {
          template,
        },
      },
      translations: { value: ['..'], format: 'json' },
    });
  },
);
