import template from './dedicated-server-firewall.html';

angular
  .module('App')
  .config(
    /* @ngInject */ ($stateProvider, coreConfigProvider) => {
      if (coreConfigProvider.region !== 'US') {
        $stateProvider.state('app.dedicated-server.server.firewall', {
          url: '/firewall',
          views: {
            'tabView@app.dedicated-server.server': {
              template,
            },
          },
          translations: { value: ['..'], format: 'json' },
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('dedicated_server_firewall'),
          },
        });
      }
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);
