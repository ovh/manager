import template from './dedicated-server-ipmi.html';

angular
  .module('App')
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.dedicated-server.server.ipmi', {
        url: '/ipmi',
        views: {
          'tabView@app.dedicated-server.server': {
            template,
          },
        },
        translations: { value: ['..'], format: 'json' },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('dedicated_server_ipmi'),
        },
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);
