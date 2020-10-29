export default /* @ngInject */ ($stateProvider) => {
  // Parent states where the modal could be called
  const parentStates = [
    'app.dedicated.server.dashboard',
    'app.dedicated.server.interfaces',
  ];

  parentStates.forEach((parent) => {
    $stateProvider.state(`${parent}.bandwidth-private-order`, {
      url: '/bandwidth-private-order',
      views: {
        modal: {
          component: 'dedicatedServerBandwidthPrivateOrder',
        },
      },
      layout: 'modal',
      translations: { value: ['.'], format: 'json' },
      resolve: {
        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
        hasDefaultPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
          ovhPaymentMethod.hasDefaultPaymentMethod(),
        trackingPrefix: () =>
          'dedicated::server::interfaces::bandwidth-private-order::',
      },
    });
  });
};
