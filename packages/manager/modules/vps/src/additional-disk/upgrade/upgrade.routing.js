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
      upgradableDisks: /* @ngInject */ (catalog, vpsLinkedDisk, VpsService) =>
        VpsService.getUpgradableAdditionalDisk(catalog, vpsLinkedDisk),

      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
  });
};
