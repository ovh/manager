angular
  .module('App')
  .config(($stateProvider) => {
    $stateProvider.state('app.networks.cdn.dedicated.manage.ssl.generate', {
      url: '/generate',
      templateUrl:
        'cdn/dedicated/manage/ssl/generate/cdn-dedicated-ssl-generate.html',
      controller: 'CdnGenerateSslCtrl',
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
