angular
  .module('App')
  .config(($stateProvider) => {
    $stateProvider.state('app.networks.cdn.dedicated.manage.logs', {
      url: '/logs',
      views: {
        cdnView: {
          templateUrl:
            'cdn/dedicated/manage/logs/cdn-dedicated-manage-logs.html',
          controller: 'CdnLogsCtrl',
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('cdn_tabs_logs'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
