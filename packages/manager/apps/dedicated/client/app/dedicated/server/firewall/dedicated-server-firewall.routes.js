import template from './dedicated-server-firewall.html';

angular.module('App').config(/* @ngInject */($stateProvider) => {
  $stateProvider.state('app.dedicated.server.firewall', {
    url: '/firewall',
    views: {
      'tabView@app.dedicated.server': {
        template,
      },
    },
    translations: { value: ['..'], format: 'json' },
  });
});
