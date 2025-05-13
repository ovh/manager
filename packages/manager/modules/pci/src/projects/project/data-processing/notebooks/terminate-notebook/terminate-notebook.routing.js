import { DATA_PROCESSING_TRACKING_PREFIX } from '../../data-processing.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.data-processing.notebooks.terminate',
    {
      url: '/terminate',
      views: {
        modal: {
          component:
            'ovhManagerPciProjectDataProcessingNotebooksTerminateNotebook',
        },
      },
      layout: 'modal',
      params: {
        notebookId: null,
        projectId: null,
      },
      resolve: {
        notebookId: /* @ngInject */ ($transition$) =>
          $transition$.params().notebookId,
        goBack: /* @ngInject */ (showNotebooks) => showNotebooks,
      },
      atInternet: {
        rename: `${DATA_PROCESSING_TRACKING_PREFIX}::notebooks::stop-notebook`,
      },
    },
  );
};
