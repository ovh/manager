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

      goBackToAttachData: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state = 'pci.projects.project.notebooks.dashboard.attach-data';
        const promise = $state.go(state, {}, { reload });
        if (message) {
          promise.then(() => {
            CucCloudMessage[type](message, state);
          });
        }
        return promise;
      },

      goToManualDataSync: /* @ngInject */ ($state, projectId) => (
        volumeId,
        directory,
      ) =>
        $state.go(
          'pci.projects.project.notebooks.dashboard.attach-data.data-sync',
          {
            projectId,
            volumeId,
            directory,
          },
        ),
      dataSync: /* @ngInject */ (projectId, notebook, NotebookService) => (
        datasyncParam,
      ) => {
        return NotebookService.dataSync(projectId, notebook.id, datasyncParam);
      },
    },
    atInternet: {
      rename:
        'pci::projects::project::ai_machine_learning::notebooks::attached_data',
    },
  });
};
