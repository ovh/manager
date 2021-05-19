import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.notebooks.dashboard', {
    url: '/:notebookId',
    component: 'ovhManagerPciProjectNotebooksDashboard',
    resolve: {
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      notebookId: /* @ngInject */ ($transition$) =>
        $transition$.params().notebookId,
      notebook: /* @ngInject */ (notebookId, notebooks) =>
        find(notebooks, { id: notebookId }),
      breadcrumb: /* @ngInject */ (notebook) => notebook.id,
      generalInformationLink: /* @ngInject */ ($state, notebookId, projectId) =>
        $state.href(
          'pci.projects.project.notebooks.dashboard.general-information',
          {
            projectId,
            notebookId,
          },
        ),
    },
    redirectTo: 'pci.projects.project.notebooks.dashboard.general-information',
  });
};
