angular
  .module('App')
  .config(($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.manage.ssl.delete', {
    url: '/delete',
    templateUrl:
      'cdn/dedicated/manage/ssl/delete/cdn-dedicated-ssl-delete.html',
    controller: 'CdnDeleteSslCtrl',
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
});
