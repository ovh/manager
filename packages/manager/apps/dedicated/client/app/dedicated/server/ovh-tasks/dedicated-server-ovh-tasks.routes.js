angular
  .module('App')
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.dedicated-server.server.dashboard.ovh-tasks', {
        url: '/ovh-tasks',
        views: {
          'tabView@app.dedicated-server.server': {
            component: 'dedicatedServerOVHTasks',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('dedicated_server_ovhTasks_backButton'),
        },
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);
