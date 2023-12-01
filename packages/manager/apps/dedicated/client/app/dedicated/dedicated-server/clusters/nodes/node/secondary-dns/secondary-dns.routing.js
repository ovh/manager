export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.secondary-dns', {
    url: '/dns',
    views: {
      'tabView@app.dedicated-cluster.cluster.node': {
        component: 'serverSecondaryDns',
      },
    },
    resolve: {
      goToAddSecondaryDns: /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-cluster.cluster.node.secondary-dns.add', {
          productId: serverName,
        }),
      goToDeleteSecondaryDns: /* @ngInject */ ($state, serverName) => ({
        domain,
      }) =>
        $state.go('app.dedicated-cluster.cluster.node.secondary-dns.delete', {
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
