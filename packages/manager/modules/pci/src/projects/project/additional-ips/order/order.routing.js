import find from 'lodash/find';

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
      publicCloudCatalog: /* @ngInject */ (
        PciProjectAdditionalIpService,
        coreConfig,
      ) =>
        PciProjectAdditionalIpService.getPublicCloudCatalog({
          ovhSubsidiary: coreConfig.getUser().ovhSubsidiary,
          productName: 'cloud',
        }),
      ipFailoverFormattedCatalog: /* @ngInject */ (
        PciProjectAdditionalIpService,
        coreConfig,
      ) =>
        PciProjectAdditionalIpService.getIpFailoverFormattedCatalog({
          ovhSubsidiary: coreConfig.getUser().ovhSubsidiary,
          productName: 'ip-failover',
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate
          .refresh()
          .then(() => $translate.instant('pci_additional_ip_create')),
      goBack: /* @ngInject */ (goToAdditionalIps) => goToAdditionalIps,
      instances: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
      ) => PciProjectsProjectInstanceService.getAllInstanceDetails(projectId),
      additionalIpInstances: /* @ngInject */ (instances) =>
        instances.filter(({ ipAddresses }) =>
          find(ipAddresses, { type: 'public' }),
        ),
      floatingIpInstances: /* @ngInject */ (instances) =>
        instances.filter(({ ipAddresses }) =>
          find(ipAddresses, { type: 'private' }),
        ),
      createInstanceUrl: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.instances.add', {
          projectId,
        }),
    },
    atInternet: {
      rename: `pci::projects::project::additional-ips::add`,
    },
  });
};
