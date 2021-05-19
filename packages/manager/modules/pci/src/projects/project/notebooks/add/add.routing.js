export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.notebooks.add', {
    url: '/new',
    component: 'pciProjectNotebooksAdd',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_notebook_add_title'),

      onNotebookAdd: /* @ngInject */ (goToNotebook) => (
        notebookInfo,
        message,
        type,
      ) => goToNotebook(notebookInfo, message, type),
    },
  });
};
