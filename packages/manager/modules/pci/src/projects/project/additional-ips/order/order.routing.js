export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.additional-ips.order', {
    url: '/order?ipType&region&instance',
    component: 'pciProjectAdditionalIpsOrder',
    params: {
      ipType: {
        dynamic: true,
        type: 'string',
      },
      region: {
        dynamic: true,
        type: 'string',
      },
      instance: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      defaults: /* @ngInject */ ($transition$) => ({
        ipType: $transition$.params().ipType,
        region: $transition$.params().region,
        instance: $transition$.params().instance,
      }),
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
