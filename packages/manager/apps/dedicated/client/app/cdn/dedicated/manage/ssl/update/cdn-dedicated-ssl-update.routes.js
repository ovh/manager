angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.manage.ssl.update', {
    url: '/update',
    templateUrl:
      'cdn/dedicated/manage/ssl/update/cdn-dedicated-ssl-update.html',
    controller: 'CdnUpdateSslCtrl',
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
});
