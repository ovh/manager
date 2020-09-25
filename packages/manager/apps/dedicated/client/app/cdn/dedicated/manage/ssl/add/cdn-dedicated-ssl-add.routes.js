angular
  .module('App')
  .config(($stateProvider) => {
    $stateProvider.state('app.networks.cdn.dedicated.manage.ssl.add', {
      url: '/add',
      templateUrl: 'cdn/dedicated/manage/ssl/add/cdn-dedicated-ssl-add.html',
      controller: 'CdnAddSslCtrl',
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
