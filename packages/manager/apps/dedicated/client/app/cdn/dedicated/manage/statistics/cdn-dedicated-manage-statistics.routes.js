import template from './cdn-dedicated-manage-statistics.html';

angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.networks.cdn.dedicated.manage.statistics', {
      views: {
        cdnView: {
          template,
          controller: 'CdnStatisticsCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
      resolve: {
        breadcrumb: () => null,
      },
    });
  },
);
