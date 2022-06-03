export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.additional-ips.order', {
    url: '/order',
    component: 'pciProjectAdditionalIpsOrder',
    resolve: {
      publicCloudCatalog: /* @ngInject */ (additionalIpService, coreConfig) =>
        additionalIpService.getPublicCloudCatalog({
          ovhSubsidiary: coreConfig.getUser().ovhSubsidiary,
          productName: 'cloud',
        }),
      breadcrumb: /* @ngInject */ () => null,
      goBack: /* @ngInject */ (goToAdditionalIps) => goToAdditionalIps,
    },
  });
};
