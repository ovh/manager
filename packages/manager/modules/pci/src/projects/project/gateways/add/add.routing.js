import { GATEWAY_FAMILY } from '../gateways.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.gateways.add', {
    url: '/new?network&subnet&region',
    component: 'pciProjectPublicGatewaysAdd',
    params: {
      network: {
        dynamic: true,
        type: 'string',
      },
      region: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_public_gateways_add_title'),
      defaults: /* @ngInject */ ($transition$) => ({
        network: $transition$.params().network,
        region: $transition$.params().region,
      }),
      catalog: /* @ngInject */ (PciPublicGatewaysService, coreConfig) => {
        return PciPublicGatewaysService.getGatwayCatalog({
          ovhSubsidiary: coreConfig.getUser().ovhSubsidiary,
        });
      },
      regionAvailability: /* @ngInject */ (
        projectId,
        PciPublicGatewaysService,
        coreConfig,
      ) => {
        return PciPublicGatewaysService.getRegions(projectId, {
          ovhSubsidiary: coreConfig.getUser().ovhSubsidiary,
          addonFamily: GATEWAY_FAMILY,
        }).then((data) => data.plans);
      },
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      onGoBackClick: /* @ngInject */ (
        projectId,
        trackPublicGateways,
        goToPrivateNetwork,
        goBack,
        defaults,
      ) => () => {
        trackPublicGateways('add::back');
        if (defaults.network && defaults.region) {
          return goToPrivateNetwork(projectId);
        }
        return goBack();
      },
    },
  });
};
