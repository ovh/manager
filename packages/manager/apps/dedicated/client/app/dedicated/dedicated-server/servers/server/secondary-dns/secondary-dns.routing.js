export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.secondary-dns', {
    url: '/dns',
    views: {
      'tabView@app.dedicated-server.server': {
        component: 'serverSecondaryDns',
      },
    },
    resolve: {
      goToAddSecondaryDns: /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-server.server.secondary-dns.add', {
          productId: serverName,
        }),
      goToDeleteSecondaryDns: /* @ngInject */ ($state, serverName) => ({
        domain,
      }) =>
        $state.go('app.dedicated-server.server.secondary-dns.delete', {
          productId: serverName,
          domain,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_dns'),
    },
    atInternet: {
      rename: 'dedicated::dedicated-server::server::dns',
    },
  });
};
