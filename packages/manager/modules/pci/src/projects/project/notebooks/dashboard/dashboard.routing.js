export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.notebooks.dashboard', {
    url: '/:notebookId',
    component: 'ovhManagerPciProjectNotebooksDashboard',
    resolve: {
      breadcrumb: /* @ngInject */ (notebook) => notebook.id,

      notebookId: /* @ngInject */ ($transition$) =>
        $transition$.params().notebookId,

      notebook: /* @ngInject */ (notebooks, notebookId) => {
        return notebooks.find(({ id }) => id === notebookId);
      },

      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),

      generalInformationLink: /* @ngInject */ ($state, projectId, notebookId) =>
        $state.href(
          'pci.projects.project.notebooks.dashboard.general-information',
          {
            projectId,
            notebookId,
          },
        ),

      attachDataLink: /* @ngInject */ ($state, projectId, notebookId) =>
        $state.href('pci.projects.project.notebooks.dashboard.attach-data', {
          projectId,
          notebookId,
        }),

      userAndRolesLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.users.add', {
          projectId,
        }),
    },
    redirectTo: 'pci.projects.project.notebooks.dashboard.general-information',
  });
};
