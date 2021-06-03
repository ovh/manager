export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'pci.projects.project.notebooks.dashboard.attach-data';
  $stateProvider.state(stateName, {
    url: '/attach-data',
    views: {
      notebookView: 'ovhManagerPciProjectNotebookAttachData',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_notebooks_tab_attach_data_title'),
      goBack: /* @ngInject */ (notebook, goToNotebook) => (message, type) =>
        goToNotebook(notebook, message, type),
    },
  });
};
