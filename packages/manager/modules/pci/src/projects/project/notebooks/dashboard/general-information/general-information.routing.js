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

      flavors: /* @ngInject */ (projectId, notebook, NotebookService) =>
        NotebookService.getFlavors(projectId, notebook.region),

      goToAddTag: /* @ngInject */ ($state, projectId, notebook) => () => {
        return $state.go(
          'pci.projects.project.notebooks.dashboard.general-information.tags-add',
          {
            projectId,
            notebook,
          },
        );
      },

      goToAttachData: /* @ngInject */ ($state, projectId, notebook) => () =>
        $state.go('pci.projects.project.notebooks.dashboard.attach-data', {
          projectId,
          notebookId: notebook.id,
        }),

      goToDeleteNotebook: /* @ngInject */ ($state, projectId, notebook) => () =>
        $state.go(
          'pci.projects.project.notebooks.dashboard.general-information.delete-notebook',
          {
            projectId,
            notebookId: notebook.id,
          },
        ),

      goToStartNotebook: /* @ngInject */ ($state, projectId, notebook) => () =>
        $state.go(
          'pci.projects.project.notebooks.dashboard.general-information.start-notebook',
          {
            projectId,
            notebookId: notebook.id,
          },
        ),

      goToStopNotebook: /* @ngInject */ ($state, projectId, notebook) => () =>
        $state.go(
          'pci.projects.project.notebooks.dashboard.general-information.stop-notebook',
          {
            projectId,
            notebookId: notebook.id,
          },
        ),

      openLiveCodeEditor: /* @ngInject */ ($window, notebook) => () =>
        $window.open(notebook.status.url, '_blank'),
    },
  });
};
