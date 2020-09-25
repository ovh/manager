angular
  .module('App')
  .config(($stateProvider) => {
    $stateProvider.state('app.networks.cdn.dedicated.manage.ssl', {
      url: '/ssl',
      views: {
        cdnView: {
          templateUrl: 'cdn/dedicated/manage/ssl/cdn-dedicated-manage-ssl.html',
          controller: 'CdnTabSslCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('cdn_dedicated_ssl'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
