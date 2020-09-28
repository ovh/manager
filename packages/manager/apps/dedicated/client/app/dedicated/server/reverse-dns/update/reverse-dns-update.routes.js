angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.update-reverse-dns', {
    url: '/update-reverse-dns',
    controller: 'ReverseDNSUpdateCtrl',
    templateUrl: 'dedicated/server/reverse-dns/update/reverse-dns-update.html',
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      breadcrumb: () => null,
    },
  });
});
