import template from './dedicated-server-intervention.html';

angular
  .module('App')
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.dedicated-server.server.intervention', {
        url: '/intervention',
        views: {
          'tabView@app.dedicated-server.server': {
            template,
          },
        },
        translations: { value: ['..'], format: 'json' },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('dedicated_server_intervention'),
        },
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);
