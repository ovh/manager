angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.delete-reverse-dns', {
    url: '/delete-reverse-dns',
    controller: 'ReverseDNSDeleteCtrl',
    templateUrl: 'dedicated/server/reverse-dns/delete/reverse-dns-delete.html',
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
});
