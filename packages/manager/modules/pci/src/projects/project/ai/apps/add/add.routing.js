import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai.apps.add', {
    url: '/new',
    component: 'ovhManagerPciAiAppsAdd',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_app_add_title'),

      createObjectStorage: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.object-storage.add', {
          projectId,
        }),

      createToken: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.ai.tokens.add', {
          projectId,
        }),

      storages: /* @ngInject */ (
        PciProjectStorageContainersService,
        projectId,
      ) =>
        PciProjectStorageContainersService.getAll(projectId).then((storages) =>
          storages.filter(({ archive }) => !archive),
        ),

      onAppAdd: /* @ngInject */ (goToApps) => (info, message, type) =>
        goToApps(info, message, type),

      regions: /* @ngInject */ (projectId, AppService) =>
        AppService.getRegions(projectId).then((regions) => {
          return map(regions, (region) => ({
            ...region,
            name: region.id,
            hasEnoughQuota: () => true,
          }));
        }),

      prices: /* @ngInject */ (projectId, CucPriceHelper) =>
        CucPriceHelper.getPrices(projectId),
    },
  });
};
