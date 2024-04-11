import { GATEWAY_FAMILY } from '../gateways.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.gateways.edit', {
    url: '/edit?gatewayId&region',
    component: 'pciProjectPublicGatewaysEdit',
    params: {
      gatewayId: {
        dynamic: true,
        type: 'string',
      },
      region: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      gatewayId: /* @ngInject */ ($transition$) =>
        $transition$.params().gatewayId,
      region: /* @ngInject */ ($transition$) => $transition$.params().region,
      goBack: /* @ngInject */ (goToPublicGateway) => goToPublicGateway,
      breadcrumb: () => null,
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
    },
    atInternet: {
      rename: 'pci::projects::project::public-gateway::update',
    },
  });
};
