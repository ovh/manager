angular.module('App').config(($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.delete-reverse-dns',
    {
      url: '/delete-reverse-dns',
      controller: 'ReverseDNSDeleteCtrl',
      templateUrl:
        'dedicated/dedicated-server/servers/reverse-dns/delete/reverse-dns-delete.html',
      layout: 'modal',
      translations: { value: ['.'], format: 'json' },
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
});
