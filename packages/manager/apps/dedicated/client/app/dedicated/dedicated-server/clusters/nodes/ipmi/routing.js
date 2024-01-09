export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.ipmi', {
    url: '/ipmi',
    views: {
      'tabView@app.dedicated-cluster.cluster.node': {
        component: 'dedicatedClusterNodeIpmi',
      },
    },
    resolve: {
      goBack: /* @ngInject */ (goToServerDetails) => goToServerDetails,
      user: /* @ngInject */ (currentUser) => currentUser,
      goToKvmOrder: /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-cluster.cluster.node.order-kvm', {
          productId: serverName,
        }),
      trackingPrefix: () => 'dedicated::dedicated-server::node::ipmi',
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_ipmi'),
    },
  });
};
