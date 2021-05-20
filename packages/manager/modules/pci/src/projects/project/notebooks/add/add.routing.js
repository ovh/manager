export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.notebooks.add', {
    url: '/new',
    component: 'pciProjectNotebooksAdd',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_notebook_add_title'),

      addStorageLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.storages.blocks.add', {
          projectId,
        }),

      onNotebookAdd: /* @ngInject */ (goToNotebook) => (
        notebookInfo,
        message,
        type,
      ) => goToNotebook(notebookInfo, message, type),

      editors: /* @ngInject */ (projectId, NotebookService) =>
        NotebookService.getEditors(projectId),

      frameworks: /* @ngInject */ (projectId, NotebookService) =>
        NotebookService.getFrameworks(projectId).then((frameworks) => {
          return frameworks.map((framework) => ({
            ...framework,
            versions: framework.versions.map((version) => ({ version })),
          }));
        }),

      regions: /* @ngInject */ (projectId, NotebookService) =>
        NotebookService.getRegions(projectId).then((regions) =>
          regions.map((region) => ({
            name: region,
            hasEnoughQuota: () => true,
          })),
        ),

      storages: /* @ngInject */ (projectId, NotebookService) =>
        NotebookService.getStorages(projectId),

      prices: /* @ngInject */ (projectId, CucPriceHelper) =>
        CucPriceHelper.getPrices(projectId),
    },
  });
};
