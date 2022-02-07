export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.additional-disk-upgrade', {
    url: '/additional-disk-upgrade',
    views: {
      modal: {
        component: 'ovhManagerVpsComponentAdditionalDiskUpgrade',
      },
    },
    layout: 'modal',
    resolve: {
      upgradableDisks: /* @ngInject */ (catalog, vpsLinkedDisk, VpsService) =>
        VpsService.getUpgradableAdditionalDisk(catalog, vpsLinkedDisk),

      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
  });
};
