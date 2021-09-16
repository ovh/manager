export default /* @ngInject */ ($stateProvider) => {
  const stateName =
    'pci.projects.project.quantum-computing.dashboard.general-information';
  $stateProvider.state(stateName, {
    url: '/general-information',
    views: {
      notebookView: 'ovhManagerPciProjectNotebookGeneralInformation',
    },
    resolve: {
      breadcrumb: () => false,

      goBack: /* @ngInject */ (notebook, goToNotebook) => (message, type) =>
        goToNotebook(notebook, message, type),

      flavors: /* @ngInject */ (projectId, notebook, QuantumService) =>
        QuantumService.getFlavors(projectId, notebook.region),

      flavor: /* @ngInject */ (notebook, flavors) =>
        notebook.getSelectedFlavor(flavors),

      goToAddTag: /* @ngInject */ (
        $state,
        projectId,
        notebook,
        trackQuantumComputing,
      ) => () => {
        return $state.go(
          'pci.projects.project.quantum-computing.dashboard.general-information.tags-add',
          {
            projectId,
            notebook,
            trackQuantumComputing,
          },
        );
      },

      goToAttachData: /* @ngInject */ ($state, projectId, notebook) => () =>
        $state.go(
          'pci.projects.project.quantum-computing.dashboard.attach-data',
          {
            projectId,
            notebookId: notebook.id,
          },
        ),

      goToDeleteNotebook: /* @ngInject */ (
        $state,
        projectId,
        notebook,
        trackQuantumComputing,
      ) => () =>
        $state.go(
          'pci.projects.project.quantum-computing.dashboard.general-information.delete-notebook',
          {
            projectId,
            notebookId: notebook.id,
            trackQuantumComputing,
          },
        ),

      goToStartNotebook: /* @ngInject */ ($state, projectId, notebook) => () =>
        $state.go(
          'pci.projects.project.quantum-computing.dashboard.general-information.start-notebook',
          {
            projectId,
            notebookId: notebook.id,
          },
        ),

      goToStopNotebook: /* @ngInject */ ($state, projectId, notebook) => () =>
        $state.go(
          'pci.projects.project.quantum-computing.dashboard.general-information.stop-notebook',
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
