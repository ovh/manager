export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.order-kvm', {
    url: '/kvm/order',
    views: {
      'tabView@app.dedicated-server.server': {
        component: 'dedicatedServerKvmOrder',
      },
    },
    resolve: {
      goBack: /* @ngInject */ /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-server.server.ipmi', {
          productId: serverName,
        }),
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('server_configuration_impi_order_kvm'),
    },
    atInternet: {
      rename: 'dedicated::dedicated-server::server::ipmi::order-kvm',
    },
  });
};
