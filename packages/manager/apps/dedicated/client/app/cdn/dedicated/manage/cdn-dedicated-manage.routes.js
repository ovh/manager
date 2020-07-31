import template from './cdn-dedicated-manage.html';

angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.networks.cdn.dedicated.manage', {
      redirectTo: 'app.networks.cdn.dedicated.manage.statistics',
      translations: { value: ['.'], format: 'json' },
      views: {
        cdnMainView: {
          template,
          controller: 'CdnManageCtrl',
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        goToDomains: /* @ngInject */ ($state) => () =>
          $state.go('app.networks.cdn.dedicated.manage.domain'),
      },
    });
  },
);
