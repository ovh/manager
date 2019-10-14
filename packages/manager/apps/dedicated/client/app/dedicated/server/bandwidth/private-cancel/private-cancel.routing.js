export default /* @ngInject */ ($stateProvider) => {
  // Parent states where the modal could be called
  const parentStates = [
    'app.dedicated.server.dashboard',
    'app.dedicated.server.interfaces',
  ];

  parentStates.forEach(
    (parent) => {
      $stateProvider.state(`${parent}.bandwidth-private-cancel`, {
        url: '/bandwidth-private-cancel',
        views: {
          modal: {
            component: 'dedicatedServerBandwidthPrivateCancel',
          },
        },
        layout: 'modal',
        translations: { value: ['.'], format: 'json' },
        resolve: {
          goBack: /* @ngInject */ $state => () => $state.go('^'),
        },
      });
    },
  );
};
