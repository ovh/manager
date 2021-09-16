export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.quantum-computing.add', {
    url: '/new',
    component: 'pciProjectQuantumComputingAdd',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_notebook_add_title'),

      createObjectStorage: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.objects.add', {
          projectId,
        }),

      onNotebookAdd: /* @ngInject */ (goToNotebook) => (
        notebookInfo,
        message,
        type,
      ) => goToNotebook(notebookInfo, message, type),

      editors: /* @ngInject */ (projectId, QuantumService) =>
        QuantumService.getEditors(projectId),

      frameworks: /* @ngInject */ (projectId, QuantumService) =>
        QuantumService.getFrameworks(projectId).then((frameworks) => {
          return frameworks.map((framework) => ({
            ...framework,
            versions: framework.versions.map((version) => ({ version })),
          }));
        }),

      regions: /* @ngInject */ (projectId, QuantumService) =>
        QuantumService.getRegions(projectId).then((regions) =>
          regions.map((region) => ({
            name: region,
            hasEnoughQuota: () => true,
          })),
        ),

      prices: /* @ngInject */ (projectId, CucPriceHelper) =>
        CucPriceHelper.getPrices(projectId),
    },
  });
};
