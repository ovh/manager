export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.ipmi', {
    url: '/ipmi',
    views: {
      'tabView@app.dedicated-server.server': {
        component: 'dedicatedServerIpmi',
      },
    },
    resolve: {
      goBack: /* @ngInject */ (goToServerDetails) => goToServerDetails,
      user: /* @ngInject */ (currentUser) => currentUser,
      goToKvmOrder: /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-server.server.order-kvm', {
          productId: serverName,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_ipmi'),
    },
  });
};
