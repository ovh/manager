export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.order-kvm', {
    url: '/kvm/order',
    views: {
      'tabView@app.dedicated-server.server': {
        component: 'dedicatedServerKvmOrder',
      },
    },
    resolve: {
      goBack: /* @ngInject */ (goToServerDetails) => goToServerDetails,
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('server_configuration_impi_order_kvm'),
    },
  });
};
