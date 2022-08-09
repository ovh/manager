export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.additional-disk.terminate', {
    url: '/terminate',
    views: {
      modal: {
        component: 'ovhManagerVpsComponentTerminate',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      serviceInfo: /* @ngInject */ (serviceInfo) => serviceInfo,
      vpsOption: /* @ngInject */ () => 'additionalDisk',
    },
    atInternet: {
      ignore: true,
    },
  });
};
