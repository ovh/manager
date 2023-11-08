export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.activate', {
    url: '/activate',
    component: 'pciProjectActivate',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_activate_title'),

      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId || null,

      goToProjectDashboard: /* @ngInject */ (goToState, projectId) => () => {
        return goToState({
          state: 'pci.projects.project',
          params: { projectId },
        });
      },
    },
  });
};
