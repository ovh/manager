export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.additional-disk.terminate', {
    url: '/terminate',
    views: {
      modal: {
        component: 'ovhManagerVpsComponentAdditionalDiskTerminate',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
  });
};
