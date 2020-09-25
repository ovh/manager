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
    translations: { value: ['.'], format: 'json' },
  });
});
