import { GATEWAY_HORULY_PLANCODE } from '../gateways.constants';

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
      regions: /* @ngInject */ (
        projectId,
        PciPublicGatewaysService,
        coreConfig,
      ) =>
        PciPublicGatewaysService.getRegionsForActivation(projectId).then(
          (inactiveRegions) => {
            return PciPublicGatewaysService.getRegions(projectId, {
              ovhSubsidiary: coreConfig.getUser().ovhSubsidiary,
              planCode: GATEWAY_HORULY_PLANCODE,
            }).then((data) =>
              data.plans
                .find((plan) => plan.code === GATEWAY_HORULY_PLANCODE)
                .regions.map((region) => {
                  return {
                    ...region,
                    hasEnoughQuota: () => true,
                    inactive: inactiveRegions.some(
                      (inactiveRegion) => inactiveRegion.name === region.name,
                    ),
                  };
                }),
            );
          },
        ),
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
