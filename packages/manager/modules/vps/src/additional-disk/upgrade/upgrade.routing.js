export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.additional-disk.upgrade', {
    url: '/upgrade',
    views: {
      modal: {
        component: 'ovhManagerVpsComponentAdditionalDiskUpgrade',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
  });
};
