export default /* @ngInject */ ($stateProvider) => {
  // Parent states where the modal could be called
  const parentStates = [
    'app.dedicated.server.dashboard',
    'app.dedicated.server.interfaces',
  ];

  parentStates.forEach((parent) => {
    $stateProvider.state(`${parent}.bandwidth-public-order`, {
      url: '/bandwidth-public-order',
      views: {
        modal: {
          component: 'dedicatedServerBandwidthPublicOrder',
        },
      },
      layout: 'modal',
      translations: { value: ['.'], format: 'json' },
      resolve: {
        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
        hasDefaultPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
          ovhPaymentMethod.hasDefaultPaymentMethod(),
      },
    });
  });
};
