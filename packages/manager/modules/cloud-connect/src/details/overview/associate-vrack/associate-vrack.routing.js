export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.associate-vrack', {
    url: '/vrack/associate',
    views: {
      modal: {
        component: 'cloudConnectDetailsAssociateVrack',
      },
    },
    layout: 'modal',
    resolve: {
      vRacks: /* @ngInject */ (cloudConnectService) =>
        cloudConnectService.getVracks(),
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
      vrackOrderUrl: /* @ngInject */ (CucVrackService) =>
        CucVrackService.getOrderUrl(),
      breadcrumb: () => null,
    },
  });
};
