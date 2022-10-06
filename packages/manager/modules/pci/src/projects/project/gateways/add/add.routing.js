import { PRODUCT_NAME } from './add.constants';

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
        PciPublicGatewaysService.getRegions(projectId, {
          ovhSubsidiary: coreConfig.getUser().ovhSubsidiary,
          product: PRODUCT_NAME.toLowerCase(),
        }).then((data) =>
          data.products
            .find((product) => product.name === PRODUCT_NAME.toLowerCase())
            .regions.map((region) => {
              return { ...region, hasEnoughQuota: () => true };
            }),
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
