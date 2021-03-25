export default /* @ngInject */ ($stateProvider) => {
  // Parent states where the modal could be called
  const parentStates = [
    'app.dedicated-server.server.dashboard',
    'app.dedicated-server.server.interfaces',
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
        breadcrumb: () => null,
      },
    });
  });
};
