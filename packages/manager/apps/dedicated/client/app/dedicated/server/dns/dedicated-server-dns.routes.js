import template from './dedicated-server-dns.html';

angular
  .module('App')
  .config(
  /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.dedicated-server.server.dns', {
      url: '/dns',
      views: {
          'tabView@app.dedicated-server.server': {
          template,
        },
      },
      translations: { value: ['..'], format: 'json' },
    });
  },
);
