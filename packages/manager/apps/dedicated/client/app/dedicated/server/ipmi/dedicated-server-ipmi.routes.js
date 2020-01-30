import template from './dedicated-server-ipmi.html';

angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicated.server.ipmi', {
      url: '/ipmi',
      views: {
        'tabView@app.dedicated.server': {
          template,
        },
      },
      translations: { value: ['..'], format: 'json' },
    });
  },
);
