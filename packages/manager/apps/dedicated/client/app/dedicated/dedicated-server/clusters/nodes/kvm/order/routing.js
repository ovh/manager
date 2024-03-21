export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.order-kvm', {
    url: '/kvm/order',
    views: {
      'tabView@app.dedicated-cluster.cluster.node': {
        component: 'dedicatedClusterNodeKvmOrder',
      },
    },
    resolve: {
      goBack: /* @ngInject */ /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-cluster.cluster.node.ipmi', {
          productId: serverName,
        }),
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('server_configuration_impi_order_kvm'),
    },
    atInternet: {
      rename: 'dedicated::dedicated-server::node::ipmi::order-kvm',
    },
  });
};
