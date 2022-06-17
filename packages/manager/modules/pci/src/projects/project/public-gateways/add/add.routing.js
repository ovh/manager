import { PRODUCT_NAME } from './add.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.public-gateways.add', {
    url: '/new',
    component: 'pciProjectPublicGatewaysAdd',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_public_gateways_add_title'),
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
    },
  });
};
