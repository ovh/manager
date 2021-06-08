import Notebook from '../../../../Notebook.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.notebooks.dashboard.general-information.tags-add',
    {
      url: '/add-tag',
      views: {
        modal: {
          component: 'pciNotebooksNotebookDashboardTagsAdd',
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
          NotebookService,
        ) => NotebookService.getNotebook(projectId, notebookId),

        notebook: /* @ngInject */ (notebookModel) =>
          new Notebook(notebookModel, null, null),
      },
    },
  );
};
