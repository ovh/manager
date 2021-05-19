export default /* @ngInject */ ($stateProvider) => {
  const stateName =
    'pci.projects.project.notebooks.dashboard.general-information';
  $stateProvider.state(stateName, {
    url: '/general-information',
    views: {
      notebookView: 'ovhManagerPciProjectNotebookGeneralInformation',
    },
    resolve: {
      breadcrumb: () => false,
      goBack: /* @ngInject */ (notebook, goToNotebook) => (message, type) =>
        goToNotebook(notebook, message, type),
    },
  });
};
