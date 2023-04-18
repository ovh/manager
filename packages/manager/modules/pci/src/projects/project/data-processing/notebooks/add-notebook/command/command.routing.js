export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.data-processing.notebooks.add-notebook.command',
    {
      url: '/command',
      views: {
        modal: {
          component: 'ovhManagerPciProjectDataProcessingAddNotebookCommand',
        },
      },
      params: {
        data: null,
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        data: /* @ngInject */ ($transition$, goBack) => {
          if ($transition$.params().data) {
            return $transition$.params().data;
          }
          return goBack();
        },
        goBack: /* @ngInject */ ($state, projectId) => (reload = false) =>
          $state.go(
            'pci.projects.project.data-processing.notebooks.add-notebook',
            {
              projectId,
            },
            {
              reload,
            },
          ),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
