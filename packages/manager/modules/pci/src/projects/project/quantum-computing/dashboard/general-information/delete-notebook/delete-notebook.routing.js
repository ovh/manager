import Notebook from '../../../QuantumComputing.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.quantum-computing.dashboard.general-information.delete-notebook',
    {
      url: '/delete-notebook',
      views: {
        modal: {
          component: 'pciQuantumComputingNotebookDashboardNotebookDelete',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,

        notebookId: /* @ngInject */ ($transition$) =>
          $transition$.params().notebookId,

        notebookModel: /* @ngInject */ (
          projectId,
          notebookId,
          QuantumService,
        ) => QuantumService.getNotebook(projectId, notebookId),

        notebook: /* @ngInject */ (notebookModel) =>
          new Notebook(notebookModel, null, null),
      },
    },
  );
};
